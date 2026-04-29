import FriendRequest from "../Models/FriendRequest.js";
import User from "../Models/User.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user._id;
    const currentUser = req.user;

    const friendIds = currentUser.friends || [];
    const excludeIds = [currentUserId, ...friendIds];

    const baseFilter = {
      _id: { $nin: excludeIds },
      isOnboarded: true,
    };

    let recommendedUsers = [];

    // 1. Try to find up to 6 random users from the same location (city)
    if (currentUser.location) {
      recommendedUsers = await User.aggregate([
        { $match: { ...baseFilter, location: currentUser.location } },
        { $sample: { size: 6 } },
      ]);
    }

    // 2. If we don't have 6 users yet, fill the rest with random users from other locations
    if (recommendedUsers.length < 6) {
      const remainingCount = 6 - recommendedUsers.length;
      const foundIds = recommendedUsers.map((u) => u._id);

      const fallbackFilter = {
        _id: { $nin: [...excludeIds, ...foundIds] },
        isOnboarded: true,
      };

      const additionalUsers = await User.aggregate([
        { $match: fallbackFilter },
        { $sample: { size: remainingCount } },
      ]);

      recommendedUsers = [...recommendedUsers, ...additionalUsers];
    }

    // Remove the password and sensitive fields from the aggregation result manually
    // because aggregates don't automatically trigger mongoose selects
    const sanitizedUsers = recommendedUsers.map((user) => {
      const { password, ...safeUser } = user;
      return safeUser;
    });

    res.status(200).json(sanitizedUsers);
  } catch (error) {
    console.error("Error in getRecommendedUsers controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate("friends", "fullName profilePic");

    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error in getMyFriends controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    // Prevent sending friend request to self
    if (myId === recipientId) {
      return res
        .status(400)
        .json({ message: "Cannot send friend request to yourself" });
    }

    // check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient user not found" });
    }

    // check if they are already friends
    if (recipient.friends.includes(myId)) {
      return res.status(400).json({ message: "You are already friends" });
    }

    // check if a friend request has already been sent
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      if (existingRequest.status === "pending") {
        return res
          .status(400)
          .json({ message: "Friend request already pending" });
      } else if (existingRequest.status === "accepted") {
        return res.status(400).json({ message: "You are already friends" });
      }
    }

    // create a new friend request
    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    console.error("Error in sendFriendRequest controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // verify the current user is the recipient of the friend request
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to accept this friend request",
      });
    }

    // update the friend request status to accepted
    friendRequest.status = "accepted";
    await friendRequest.save();

    // add each user to the other's friends list
    // use $addToSet to avoid duplicates in case of multiple friend requests
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Error in acceptFriendRequest controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getFriendRequest(req, res) {
  try {
    // fetch incoming friend requests where the current user is the recipient and status is pending
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender", "fullName profilePic");

    // "X accepted your request" → shown to the sender, not the recipient
    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic");

    // return the list of incoming friend requests
    res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (error) {
    console.error("Error in getFriendRequest controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getOutgoingFriendRequests(req, res) {
  try {
    // fetch outgoing friend requests where the current user is the sender and status is pending
    const outgoingReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePic");

    res.status(200).json(outgoingReqs);
  } catch (error) {
    console.error(
      "Error in getOutgoingFriendRequests controller:",
      error.message,
    );
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function declineFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Both the sender (cancelling) and recipient (declining) may delete it
    const isInvolved =
      friendRequest.recipient.toString() === req.user.id ||
      friendRequest.sender.toString() === req.user.id;

    if (!isInvolved) {
      return res.status(403).json({
        message: "You are not authorized to remove this friend request",
      });
    }

    await FriendRequest.findByIdAndDelete(requestId);

    res.status(200).json({ message: "Friend request removed" });
  } catch (error) {
    console.error("Error in declineFriendRequest controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}


export async function updateProfile(req, res) {
  try {
    const { fullName, bio, location, profileImage } = req.body;
    const userId = req.user.id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prepare fields to update. Only update if provided in the body layer.
    // The profileImage will be a base64 string
    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (profileImage !== undefined) updateData.profilePic = profileImage;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true },
    ).select("-password -__v");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in updateProfile controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function removeFriend(req, res) {
  try {
    const myId = req.user.id;
    const { id: friendId } = req.params;

    if (myId === friendId) {
      return res.status(400).json({ message: "Cannot unfriend yourself" });
    }

    // Remove each user from the other's friends list atomically
    await Promise.all([
      User.findByIdAndUpdate(myId, { $pull: { friends: friendId } }),
      User.findByIdAndUpdate(friendId, { $pull: { friends: myId } }),
    ]);

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    console.error("Error in removeFriend controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
