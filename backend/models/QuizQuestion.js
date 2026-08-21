import mongoose from "mongoose";

const quizQuestionSchema = new mongoose.Schema(
  {
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
    question: {
      type: String,
      required: [true, "Question text is required"],
    },
    options: {
      
      type: [String],
      validate: {
        validator: (arr) => arr.length === 4,
        message: "A question must have exactly 4 options",
      },
      required: true,
    },
    correctAnswerIndex: {
      
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },
  },
  { timestamps: true }
);

quizQuestionSchema.index({ planet: 1, difficulty: 1 }); 

export default mongoose.model("QuizQuestion", quizQuestionSchema);