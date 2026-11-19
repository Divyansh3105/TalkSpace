import express from "express";
import { isValidObjectId } from "mongoose";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getStreamToken, openChannel } from "../controllers/chat.controller.js";

const router = express.Router();

router.param("id", (req, res, next, id) => {
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }
  next();
});

router.get("/token", protectRoute, getStreamToken);
router.post("/channel/:id", protectRoute, openChannel);

export default router;
