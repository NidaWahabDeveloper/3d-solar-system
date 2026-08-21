import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planet: {
      
      type: mongoose.Schema.Types.ObjectId,
      ref: "Planet",
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"], 
      required: true,
    },
    score: {
      type: Number, 
      required: true,
      min: 0,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    timeTakenSeconds: {
      
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);


quizResultSchema.index({ planet: 1, difficulty: 1, score: -1, timeTakenSeconds: 1 });

export default mongoose.model("QuizResult", quizResultSchema);