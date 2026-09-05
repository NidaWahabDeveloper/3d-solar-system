

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
import { createServer } from "http"; // Node.js ka built-in HTTP server -- Socket.io ko iske upar chalna padta hai
import { Server } from "socket.io"; // Socket.io ka Server class

dotenv.config();


if (process.env.NODE_ENV !== "test") {
  connectDB();
}

const app = express(); 
app.set('trust proxy', 1);
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


// if (process.env.NODE_ENV !== "test") {
//   app.listen(PORT, () => {
//     console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
//   });
// }  

const httpServer = createServer(app);
// Socket.io server banao, is HTTP server ke upar
const io = new Server( httpServer, {
  cors: {
    origin: process.env.CLIENT_URL, // sirf apna frontend allow karo, jaise normal CORS
    credentials: true,
  },
});

// Jab bhi koi naya browser connect kare (website khole), ye chalega
io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);
  // Jab user disconnect ho (tab band kare)
  socket.on("disconnect", () => {
    console.log("A user disconnected: " + socket.id);
  });
});
// Ye "io" ko baaki files (jaise commentController.js) me use karne ke liye available banate hain
app.set("io", io);

if (process.env.NODE_ENV !== "test") {
  httpServer.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}


export default app; 