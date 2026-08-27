import express from "express";
import { body } from "express-validator"; // lets us write validation rules declaratively
// import { registerUser, loginUser, getMe } from "../controllers/authController.js";
import { registerUser, loginUser, getMe, verifyEmail } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router(); // handles all /api/auth/* routes

// POST /api/auth/register
router.post(
  "/register",
  authLimiter, // limits repeated signup attempts (anti brute-force)
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("A valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  validateRequest, // rejects the request with 400 if any rule above fails
  registerUser
);

// POST /api/auth/login
router.post(
  "/login",
  authLimiter, // limits repeated login attempts (anti brute-force)
  [
    body("email").isEmail().withMessage("A valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  loginUser
);

// GET /api/auth/me
// protect middleware checks for a valid JWT before letting the request through
router.get("/me", protect, getMe);
// GET /api/auth/verify/:token -- public, koi bhi (bina login ke) link click kar sake
router.get("/verify/:token", verifyEmail);

export default router;