import mongoose from "mongoose";

// Schema for comments users leave on a planet's page
const commentSchema = new mongoose.Schema(
  {
    // reference to the planet this comment belongs to
    planet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Planet",
      required: true,
    },

    // reference to the user who wrote the comment
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // actual comment text
    text: {
      type: String,
      required: [true, "Comment text cannot be empty"],
      trim: true,
      maxlength: [500, "Comment must be under 500 characters"], // avoid huge/spammy comments
    },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

// Most queries look like: "get all comments for a planet, newest first"
// so this index makes that lookup fast
commentSchema.index({ planet: 1, createdAt: -1 });

export default mongoose.model("Comment", commentSchema);