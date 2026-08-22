import asyncHandler from "express-async-handler"; // catches async errors and forwards to errorHandler
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body; // validated already by express-validator middleware

  // Check if an account with this email already exists before creating a new one
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  // Mongoose's pre-save hook (in the User model) hashes the password automatically here
  const user = await User.create({ name, email, password });

  // Respond with the user's public info + a fresh JWT so they're logged in immediately after signup
  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    },
  });
});

// @desc    Log in an existing user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // .select("+password") is needed because the schema hides password by default (select: false)
  const user = await User.findOne({ email }).select("+password");

  // Check BOTH "user exists" and "password matches" in one condition. We deliberately give the
  // SAME generic error for both cases -- revealing "email not found" vs "wrong password"
  // separately would let attackers enumerate valid emails (a security best practice).
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    },
  });
});

// @desc    Get the currently logged-in user's profile
// @route   GET /api/auth/me
// @access  Private (requires valid JWT)
export const getMe = asyncHandler(async (req, res) => {
  // req.user was already attached by the `protect` middleware -- no extra DB call needed
  res.status(200).json({ success: true, data: req.user });
});
