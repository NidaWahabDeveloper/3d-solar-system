import asyncHandler from "express-async-handler"; // catches async errors and forwards to errorHandler
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto"; // Node.js ka built-in tool -- random secure strings banane ke liye (token ke liye)
import sendEmail from "../utils/sendEmail.js"; // humari email bhejne wali file

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  // Ek random, unique token banao jo sirf isi user ki verification link me jayega
  const verificationToken = crypto.randomBytes(32).toString("hex");

  // User ko banate waqt hi token bhi save kar do database me
  const user = await User.create({
    name,
    email,
    password,
    verificationToken,
  });

  // Verification link banao -- CLIENT_URL (frontend ka address) + route + token
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  // Email bhejo (agar email bhejne me koi masla ho, register phir bhi fail nahi hona chahiye --
  // isliye try/catch se wrap kiya, taake sirf email fail ho, poora registration na toote)
  try {
    await sendEmail({
      to: user.email,
      subject: "Verify your Solar System Explorer account",
      html: `
        <h2>Welcome to Solar System Explorer!</h2>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
      `,
    });
  } catch (error) {
    console.error("Email could not be sent:", error.message);
  }

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      token: generateToken(user._id),
    },
  });
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// export const registerUser = asyncHandler(async (req, res) => {
//   const { name, email, password } = req.body; // validated already by express-validator middleware

//   // Check if an account with this email already exists before creating a new one
//   const userExists = await User.findOne({ email });
//   if (userExists) {
//     res.status(400);
//     throw new Error("An account with this email already exists");
//   }

//   // Mongoose's pre-save hook (in the User model) hashes the password automatically here
//   const user = await User.create({ name, email, password });

//   // Respond with the user's public info + a fresh JWT so they're logged in immediately after signup
//   res.status(201).json({
//     success: true,
//     data: {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       token: generateToken(user._id),
//     },
//   });
// });

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
