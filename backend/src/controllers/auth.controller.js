import { upsertStreamUser } from "../lib/stream.js";
import User from "../Models/User.js";
import jwt from "jsonwebtoken";

// Request bodies are already checked by the Zod schemas in auth.route.js

const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

const cookieOptions = () => ({
  httpOnly: true, // Prevents XSS attacks
  sameSite: "Strict", // CSRF protection
  secure: process.env.NODE_ENV === "production", // Use secure cookies in production
});

function setAuthCookie(res, userId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("token", token, { ...cookieOptions(), maxAge: SESSION_MS });
}

export async function signup(req, res) {
  const { fullName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const seed = Math.random().toString(36).substring(2, 10);
    const randomAvatar = `https://api.dicebear.com/9.x/personas/svg?seed=${seed}`;

    const newUser = await User.create({
      fullName,
      email,
      password,
      profilePic: randomAvatar,
    });

    await upsertStreamUser({
      id: newUser._id.toString(),
      name: newUser.fullName,
      image: newUser.profilePic,
    });

    setAuthCookie(res, newUser._id);

    const { password: _pw, ...safeNewUser } = newUser.toObject();
    res.status(201).json({ success: true, user: safeNewUser });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Explicitly select password — it's excluded by default (select: false in schema)
    const user = await User.findOne({ email }).select("+password -__v");
    // Accounts created via the removed Google login have no password
    if (!user?.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    setAuthCookie(res, user._id);

    // Strip password before sending response
    const { password: _pw, ...safeUser } = user.toObject();
    res.status(200).json({ success: true, user: safeUser });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export function logout(req, res) {
  res.clearCookie("token", cookieOptions());
  res.status(200).json({ success: true, message: "Logged out successfully" });
}

export async function onboard(req, res) {
  try {
    const userId = req.user._id;

    const { fullName, bio, location, profilePic } = req.body;

    // Whitelist only expected fields — never spread req.body directly into the DB
    const updateData = {
      fullName,
      bio,
      location,
      isOnboarded: true,
      ...(profilePic !== undefined && { profilePic }),
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-__v");
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    await upsertStreamUser({
      id: updatedUser._id.toString(),
      name: updatedUser.fullName,
      image: updatedUser.profilePic,
    });

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
