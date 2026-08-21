import express from "express";
import { body } from "express-validator";
import {
  getQuizQuestions,
  submitQuiz,
  getLeaderboard,
  createQuizQuestion,
  updateQuizQuestion,
  deleteQuizQuestion,
} from "../controllers/quizController.js";
import { protect, authorize } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";
import { cacheRoute } from "../middleware/cacheMiddleware.js";

const router = express.Router();


router.get("/:planetId/:difficulty", getQuizQuestions);
router.get("/:planetId/:difficulty/leaderboard", cacheRoute("leaderboard"), getLeaderboard);


router.post(
  "/:planetId/:difficulty/submit",
  protect,
  [
    body("answers").isArray({ min: 1 }).withMessage("Answers must be a non-empty array"),
    body("timeTakenSeconds").isInt({ min: 0 }).withMessage("timeTakenSeconds must be a positive number"),
  ],
  validateRequest,
  submitQuiz
);


const questionValidationRules = [
  body("planet").notEmpty().withMessage("planet id is required"),
  body("difficulty").isIn(["easy", "medium", "hard"]).withMessage("difficulty must be easy, medium, or hard"),
  body("question").trim().notEmpty().withMessage("question text is required"),
  body("options").isArray({ min: 4, max: 4 }).withMessage("exactly 4 options are required"),
  body("correctAnswerIndex").isInt({ min: 0, max: 3 }).withMessage("correctAnswerIndex must be 0-3"),
];

router.post("/questions", protect, authorize("admin"), questionValidationRules, validateRequest, createQuizQuestion);
router.put("/questions/:id", protect, authorize("admin"), updateQuizQuestion);
router.delete("/questions/:id", protect, authorize("admin"), deleteQuizQuestion);

export default router;