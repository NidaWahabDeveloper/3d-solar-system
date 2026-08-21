// notFound - jab koi route match hi nahi hota to yeh chalta hai
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404); // status pehle set karo, taake errorHandler ko pata ho ye 404 tha
  next(error); // error handler ke pass bhej do, aage koi normal route nahi chalega
};

// errorHandler - chain ka aakhri middleware (4 params dekh ke express samajh jata hai ye error handler hai)
// jahan bhi app me error throw ho ya next(error) call ho, wo yahan aa kar khatam hota hai
export const errorHandler = (err, req, res, next) => {
  // agar status set nahi kiya gaya to default 500 (server error) rakho
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose ka CastError tab aata hai jab galat MongoDB id url me di ho
  // jaise GET /api/planets/not-a-real-id -- isko clean 404 bana do, 500 nahi
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  }

  // duplicate key error - jaise koi already registered email se dobara signup kare
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `An account with that ${field} already exists`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    // stack trace sirf development me dikhao, production me kabhi nahi
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};