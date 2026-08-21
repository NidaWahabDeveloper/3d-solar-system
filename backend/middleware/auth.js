import jwt from "jsonwebtoken"; // token verify karne ke liye
import asyncHandler from "express-async-handler"; // async errors ko khud handle kar leta hai
import User from "../models/User.js";

// protect middleware - login required routes ke upar lagta hai
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // client "Authorization: Bearer <token>" format me bhejta hai
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    // "Bearer" hata ke sirf token wala part nikal lo
    token = req.headers.authorization.split(" ")[1];
  }

  // token hi nahi mila to aage jaane ka koi faida nahi
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }

  try {
    // secret key se verify karo ke token sahi hai aur expire nahi hua
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // token ke andar jo id thi usse user dhoond lo, password field skip kar do
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      // ho sakta hai user delete ho chuka ho token banne ke baad
      res.status(401);
      throw new Error("User belonging to this token no longer exists");
    }

    next(); // sab sahi hai, ab route ki actual logic chalne do
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token failed verification");
  }
});

// authorize - allowed roles pass karo, jaise authorize("admin")
// hamesha protect ke baad use hoga kyunke req.user pehle se set hona chahiye
export const authorize = (...roles) => {
  return (req, res, next) => {
    // agar current user ka role allowed list me nahi hai
    if (!roles.includes(req.user.role)) {
      res.status(403); // pata hai kaun ho, lekin permission nahi
      throw new Error(`Role '${req.user.role}' is not permitted to perform this action`);
    }

    next(); // role match ho gaya, aage jaao
  };
};