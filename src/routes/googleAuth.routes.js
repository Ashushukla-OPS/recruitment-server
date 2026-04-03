import express from "express";
import passport from "passport";
import { googleAuthCallback, authFailed, getMe } from "../controllers/googleAuth.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/api/auth/failed",
  }),
  googleAuthCallback,
);

router.get("/failed", authFailed);

router.get("/me", isAuthenticated, getMe);

export default router;
