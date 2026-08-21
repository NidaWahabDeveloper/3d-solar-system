

import express from "express"; 
import dotenv from "dotenv"; 
import cors from "cors"; 
import helmet from "helmet"; 
import compression from "compression"; 
import mongoSanitize from "express-mongo-sanitize";  
import xss from "xss-clean"; 
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiter.js";


import authRoutes from "./routes/authRoutes.js";
import planetRoutes from "./routes/planetRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";

dotenv.config();


if (process.env.NODE_ENV !== "test") {
  connectDB();
}

const app = express(); 
app.use(helmet()); 
app.use(compression()); 
app.use(
  cors({
    origin: process.env.CLIENT_URL, 
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" })); 
app.use(mongoSanitize()); 
app.use(xss()); 
app.use(apiLimiter); 


app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});


app.use("/api/auth", authRoutes);
app.use("/api/planets", planetRoutes); 
app.use("/api/comments", commentRoutes); 
app.use("/api/quiz", quizRoutes);

app.use(notFound); 
app.use(errorHandler); 

const PORT = process.env.PORT || 5000;


if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}

export default app; 