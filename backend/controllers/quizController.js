import asyncHandler from "express-async-handler";
import QuizQuestion from "../models/QuizQuestion.js";
import QuizResult from "../models/QuizResult.js";


export const getQuizQuestions = asyncHandler(async (req, res) => {
  const { planetId, difficulty } = req.params;

  const questions = await QuizQuestion.find({ planet: planetId, difficulty })
   
    .select("-correctAnswerIndex");

  res.status(200).json({ success: true, count: questions.length, data: questions });
});


export const submitQuiz = asyncHandler(async (req, res) => {
  const { planetId, difficulty } = req.params;
  
  const { answers, timeTakenSeconds } = req.body;

  
  const questions = await QuizQuestion.find({ planet: planetId, difficulty });

  let score = 0;
  for (const q of questions) {
    
    const submitted = answers.find((a) => a.questionId === q._id.toString());
    if (submitted && submitted.selectedIndex === q.correctAnswerIndex) {
      score += 1; 
    }
  }

  
  const result = await QuizResult.create({
    user: req.user._id,
    planet: planetId,
    difficulty,
    score,
    totalQuestions: questions.length,
    timeTakenSeconds,
  });

  res.status(201).json({
    success: true,
    data: { score, totalQuestions: questions.length, resultId: result._id },
  });
});


export const getLeaderboard = asyncHandler(async (req, res) => {
  const { planetId, difficulty } = req.params;

  const leaderboard = await QuizResult.find({ planet: planetId, difficulty })
    
    .sort({ score: -1, timeTakenSeconds: 1 })
    .limit(10) 
    .populate("user", "name"); 

  res.status(200).json({ success: true, data: leaderboard });
});


export const createQuizQuestion = asyncHandler(async (req, res) => {
  const question = await QuizQuestion.create(req.body);
  res.status(201).json({ success: true, data: question });
});


export const updateQuizQuestion = asyncHandler(async (req, res) => {
  const question = await QuizQuestion.findById(req.params.id);
  if (!question) {
    res.status(404);
    throw new Error("Quiz question not found");
  }
  Object.assign(question, req.body);
  await question.save();
  res.status(200).json({ success: true, data: question });
});


export const deleteQuizQuestion = asyncHandler(async (req, res) => {
  const question = await QuizQuestion.findById(req.params.id);
  if (!question) {
    res.status(404);
    throw new Error("Quiz question not found");
  }
  await question.deleteOne();
  res.status(200).json({ success: true, data: {} });
});