import express from "express";
import {
  signup,
  login,
  logout,
  onboard,
  googleAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  signupSchema,
  loginSchema,
  onboardSchema,
} from "../lib/validation.schemas.js";

const router = express.Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.post("/google", googleAuth); // token validated by Google SDK — no body schema needed

router.post("/onboarding", protectRoute, validate(onboardSchema), onboard);

// check if user is logged in and return user data
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
