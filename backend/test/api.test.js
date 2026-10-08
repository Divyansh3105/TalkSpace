// API tests against the real Express app, with Mongo and Stream stubbed in
// memory so they run without a database or network. Run: npm test
import { test, before, after } from "node:test";
import assert from "node:assert/strict";

Object.assign(process.env, {
  NODE_ENV: "test",
  MONGODB_URI: "mongodb://unused",
  JWT_SECRET: "test-secret",
  STREAM_API_KEY: "test",
  STREAM_API_SECRET: "test",
  CORS_ORIGIN: "http://localhost:5173",
});

const { default: mongoose } = await import("mongoose");
const { default: jwt } = await import("jsonwebtoken");
const { StreamChat } = await import("stream-chat");
const { default: User } = await import("../src/Models/User.js");
const { default: FriendRequest } = await import("../src/Models/FriendRequest.js");
const { app } = await import("../src/app.js");

// Any DB call a test forgot to stub fails fast instead of hanging
mongoose.set("bufferCommands", false);
StreamChat.getInstance().upsertUser = async () => {};

// ─── In-memory User store ────────────────────────────────────────────────────

const users = new Map();
const toDoc = (u) =>
  u && {
    ...u,
    id: u._id,
    toObject: () => ({ ...u }),
    matchPassword: async (p) => p === u.password,
  };
// Chainable stand-in for a Mongoose query
const query = (val) => ({
  select: () => query(val),
  populate: () => query(val),
  then: (ok, fail) => Promise.resolve(val).then(ok, fail),
});
let nextId = 1;
const newId = () => (nextId++).toString(16).padStart(24, "0");

User.findById = (id) => query(toDoc(users.get(String(id))));
User.findOne = ({ email }) =>
  query(toDoc([...users.values()].find((u) => u.email === email)));
User.create = async (data) => {
  const u = { friends: [], ...data, _id: String(data._id ?? newId()) };
  users.set(u._id, u);
  return toDoc(u);
};
User.findByIdAndUpdate = (id, update) => {
  const u = users.get(String(id));
  if (u && !update.$pull) Object.assign(u, update.$set ?? update);
  return query(toDoc(u));
};

const addUser = (fields) => {
  const u = { _id: newId(), fullName: "Test User", friends: [], ...fields };
  users.set(u._id, u);
  return u;
};
const cookieFor = (u) => `token=${jwt.sign({ userId: u._id }, process.env.JWT_SECRET)}`;

// ─── Server ──────────────────────────────────────────────────────────────────

let server, base;
before(() => {
  server = app.listen(0);
  base = `http://localhost:${server.address().port}`;
});
after(() => server.close());

const send = (method, path, { body, cookie } = {}) =>
  fetch(base + path, {
    method,
    headers: {
      ...(body && { "content-type": "application/json" }),
      ...(cookie && { cookie }),
    },
    body: body && JSON.stringify(body),
  });

// ─── Auth ────────────────────────────────────────────────────────────────────

test("invalid login body returns 400 with per-field errors", async () => {
  const res = await send("POST", "/api/auth/login", {
    body: { email: "not-an-email", password: "1" },
  });
  assert.equal(res.status, 400);
  const { errors } = await res.json();
  assert.deepEqual(errors.map((e) => e.field).sort(), ["email", "password"]);
});

test("signup sets an httpOnly, SameSite=Strict session cookie", async () => {
  const res = await send("POST", "/api/auth/signup", {
    body: { fullName: "Ana", email: "ana@example.com", password: "secret123" },
  });
  assert.equal(res.status, 201);
  const cookie = res.headers.get("set-cookie");
  assert.match(cookie, /^token=/);
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /SameSite=Strict/);
  assert.equal((await res.json()).user.password, undefined);
});

test("signup saves no account when Stream is down, so a retry works", async () => {
  const upsert = StreamChat.getInstance().upsertUser;
  StreamChat.getInstance().upsertUser = async () => {
    throw new Error("Stream down");
  };
  const body = { fullName: "Bo", email: "bo@example.com", password: "secret123" };
  try {
    assert.equal((await send("POST", "/api/auth/signup", { body })).status, 500);
  } finally {
    StreamChat.getInstance().upsertUser = upsert;
  }
  assert.equal((await send("POST", "/api/auth/signup", { body })).status, 201);
});

test("concurrent duplicate signup returns 400, not 500", async () => {
  const create = User.create;
  User.create = async () => {
    throw Object.assign(new Error("E11000 duplicate key"), { code: 11000 });
  };
  try {
    const res = await send("POST", "/api/auth/signup", {
      body: { fullName: "Cy", email: "cy@example.com", password: "secret123" },
    });
    assert.equal(res.status, 400);
  } finally {
    User.create = create;
  }
});

test("login works and never returns the password", async () => {
  const res = await send("POST", "/api/auth/login", {
    body: { email: "ana@example.com", password: "secret123" },
  });
  assert.equal(res.status, 200);
  assert.equal((await res.json()).user.password, undefined);
});

test("login for an account without a password returns 401, not 500", async () => {
  addUser({ email: "google@example.com" }); // created by the old Google login
  const res = await send("POST", "/api/auth/login", {
    body: { email: "google@example.com", password: "whatever1" },
  });
  assert.equal(res.status, 401);
});

test("logout clears the session cookie", async () => {
  const res = await send("POST", "/api/auth/logout");
  assert.match(res.headers.get("set-cookie"), /^token=;.*Expires=Thu, 01 Jan 1970/);
});

// ─── Users ───────────────────────────────────────────────────────────────────

test("malformed :id returns 400 on every :id route", async () => {
  const cookie = cookieFor(addUser({ email: "ids@example.com" }));
  for (const [method, path] of [
    ["GET", "/api/users/bad/avatar"],
    ["DELETE", "/api/users/friends/bad"],
    ["POST", "/api/users/friend-request/bad"],
    ["PUT", "/api/users/friend-request/bad/accept"],
    ["DELETE", "/api/users/friend-request/bad/decline"],
  ]) {
    assert.equal((await send(method, path, { cookie })).status, 400, `${method} ${path}`);
  }
});

test("recommended users expose only public profile fields", async () => {
  const me = addUser({ email: "rec@example.com", location: "Pune" });
  addUser({ email: "secret@example.com", password: "hash", isOnboarded: true, location: "Pune", bio: "hi" });
  // Applies the pipeline's $project like Mongo would; everything else is ignored
  User.aggregate = async (pipeline) => {
    const fields = Object.keys(pipeline.find((s) => s.$project)?.$project ?? {});
    return [...users.values()]
      .filter((u) => u.isOnboarded)
      .map((u) => Object.fromEntries(Object.entries(u).filter(([k]) => k === "_id" || fields.includes(k))));
  };

  const res = await send("GET", "/api/users", { cookie: cookieFor(me) });
  assert.equal(res.status, 200);
  const [user] = await res.json();
  assert.deepEqual(Object.keys(user).sort(), ["_id", "bio", "fullName", "location"]);
});

test("double-clicked friend request returns 400, not 500", async () => {
  const me = addUser({ email: "dbl@example.com" });
  const them = addUser({ email: "dbl2@example.com" });
  FriendRequest.findOne = async () => null; // both clicks pass the existence check
  FriendRequest.create = async () => {
    throw Object.assign(new Error("E11000 duplicate key"), { code: 11000 });
  };

  const res = await send("POST", `/api/users/friend-request/${them._id}`, { cookie: cookieFor(me) });
  assert.equal(res.status, 400);
});

test("removing a friend also deletes their friend request, so they can re-add", async () => {
  const me = addUser({ email: "me@example.com" });
  const friend = addUser({ email: "friend@example.com" });
  let filter;
  FriendRequest.deleteMany = async (f) => {
    filter = f;
  };

  const res = await send("DELETE", `/api/users/friends/${friend._id}`, {
    cookie: cookieFor(me),
  });
  assert.equal(res.status, 200);
  assert.deepEqual(filter, {
    $or: [
      { sender: me._id, recipient: friend._id },
      { sender: friend._id, recipient: me._id },
    ],
  });
});

test("avatar upload is stored and served back from profilePic", async () => {
  const me = addUser({ email: "pic@example.com" });
  const bytes = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3]);

  const res = await send("PUT", "/api/users/profile", {
    cookie: cookieFor(me),
    body: { profileImage: `data:image/jpeg;base64,${bytes.toString("base64")}` },
  });
  assert.equal(res.status, 200);
  const { profilePic } = await res.json();
  assert.match(profilePic, new RegExp(`/api/users/${me._id}/avatar\\?v=\\d+$`));

  const img = await fetch(profilePic); // public: no cookie
  assert.equal(img.status, 200);
  assert.equal(img.headers.get("content-type"), "image/jpeg");
  assert.equal(img.headers.get("x-content-type-options"), "nosniff");
  assert.deepEqual(Buffer.from(await img.arrayBuffer()), bytes);
});

test("SVG avatars are rejected", async () => {
  const res = await send("PUT", "/api/users/profile", {
    cookie: cookieFor(addUser({ email: "svg@example.com" })),
    body: { profileImage: `data:image/svg+xml;base64,${btoa("<svg/>")}` },
  });
  assert.equal(res.status, 400);
});

// ─── Rate limiting (last: it uses up the login quota) ────────────────────────

test("login is rate limited but /me is not", async () => {
  const statuses = [];
  for (let i = 0; i < 21; i++) {
    statuses.push(
      (await send("POST", "/api/auth/login", { body: { email: "x@example.com", password: "secret123" } })).status,
    );
  }
  assert.equal(statuses.at(-1), 429);

  for (let i = 0; i < 25; i++) {
    assert.equal((await send("GET", "/api/auth/me")).status, 401); // unauthenticated, never 429
  }
});
