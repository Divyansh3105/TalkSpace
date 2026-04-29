import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, "Full name must be 100 characters or fewer"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [254, "Email must be 254 characters or fewer"],
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      minlength: 6,
      maxlength: [128, "Password must be 128 characters or fewer"],
      select: false, // Never returned by default — opt-in with .select("+password")
    },
    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: [300, "Bio must be 300 characters or fewer"],
    },
    profilePic: {
      type: String,
      default: "",
      maxlength: [2048, "Profile picture URL must be 2048 characters or fewer"],
    },
    location: {
      type: String,
      default: "",
      trim: true,
      maxlength: [100, "Location must be 100 characters or fewer"],
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = async function (candidatePassword) {
  const isPasswordMatch = await bcrypt.compare(
    candidatePassword,
    this.password,
  );
  return isPasswordMatch;
};

const User = mongoose.model("User", userSchema);

export default User;
