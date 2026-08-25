import asyncHandler from "express-async-handler";
import Comment from "../models/Comment.js";
import Planet from "../models/Planet.js";

// GET /api/planets/:planetId/comments
// public route - koi bhi comments dekh sakta hai, login zaroori nahi
export const getCommentsForPlanet = asyncHandler(async (req, res) => {
  const { planetId } = req.params;

  const comments = await Comment.find({ planet: planetId })
    .sort("-createdAt")            // latest wale upar
    .populate("user", "name");     // sirf name chahiye, poora user object nahi

  res.status(200).json({
    success: true,
    count: comments.length,
    data: comments,
  });
});

// POST /api/planets/:planetId/comments
// login required - protect middleware yahan pehle chalta hai
export const addComment = asyncHandler(async (req, res) => {
  const planet = await Planet.findById(req.params.planetId);

  // agar planet hi exist nahi karta to comment karne ka koi matlab nahi
  if (!planet) {
    res.status(404);
    throw new Error("Planet not found");
  }

  const newComment = await Comment.create({
    planet: req.params.planetId,
    user: req.user._id,   // req.user protect middleware se aata hai, spoof nahi ho sakta
    text: req.body.text,
  });

  // frontend ko turant author ka naam chahiye hoga render karne ke liye
  await newComment.populate("user", "name");

  const io = req.app.get("io");
io.emit("newComment", comment); // sab connected users ko forun naya comment bhej do

  res.status(201).json({ success: true, data: newComment });
});

// DELETE /api/comments/:id
// sirf comment ka owner ya admin hi delete kar sakta hai
export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  const isOwner = comment.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  // dono me se ek bhi condition true nahi to allow mat karo
  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error("Not authorized to delete this comment");
  }
  

  await comment.deleteOne();

  

  res.status(200).json({ success: true, data: {} });
});