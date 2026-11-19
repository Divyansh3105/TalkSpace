import { StreamChat } from "stream-chat";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("Stream API key and secret are required");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

// Both throw on failure; callers turn that into a 500 rather than carrying on half-synced
export const upsertStreamUser = async (userData) => {
  await streamClient.upsertUser(userData);
  return userData;
};

export const generateStreamToken = (userId) => streamClient.createToken(userId.toString());

// One "messaging" channel per pair, same id whoever opens it
const directChannel = (a, b, data) =>
  streamClient.channel("messaging", [String(a), String(b)].sort().join("-"), data);

// Only the server creates 1:1 channels, after checking the two are friends.
// addMembers re-adds a pair who unfriended and became friends again.
export const openDirectChannel = async (me, other) => {
  const channel = directChannel(me, other, { members: [String(me), String(other)], created_by_id: String(me) });
  await channel.create();
  await channel.addMembers([String(me), String(other)]);
  return channel.id;
};

// Unfriending takes both out of their channel, so the history stays but neither can post
export const closeDirectChannel = async (a, b) => {
  await directChannel(a, b).removeMembers([String(a), String(b)]);
};
