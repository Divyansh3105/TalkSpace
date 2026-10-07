import express from "express";
import { isValidObjectId } from "mongoose";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  acceptFriendRequest,
  declineFriendRequest,
  getAvatar,
  getFriendRequest,
  getMyFriends,
  getOutgoingFriendRequests,
  getRecommendedUsers,
  removeFriend,
  sendFriendRequest,
  updateProfile,
} from "../controllers/user.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { updateProfileSchema } from "../lib/validation.schemas.js";

const router = express.Router();

// Every :id route takes a Mongo id; reject malformed ones here instead of
// letting Mongoose throw a CastError that surfaces as a 500
router.param("id", (req, res, next, id) => {
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }
  next();
});

// Public: loaded by <img> tags and Stream, which don't send our auth cookie
router.get("/:id/avatar", getAvatar);

router.use(protectRoute); // protect all routes below
router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);
router.delete("/friends/:id", removeFriend);
router.put("/profile", validate(updateProfileSchema), updateProfile);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);
router.delete("/friend-request/:id/decline", declineFriendRequest);

router.get("/friend-request/", getFriendRequest);
router.get("/outgoing-friend-request/", getOutgoingFriendRequests);

export default router;
