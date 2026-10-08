import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

// One request per direction; stops double-click duplicates.
// ponytail: A→B and B→A sent at the same instant can still both land; needs a sorted-pair key if that matters
friendRequestSchema.index({ sender: 1, recipient: 1 }, { unique: true });

const FriendRequest =mongoose.model("FriendRequest", friendRequestSchema);

export default FriendRequest;
