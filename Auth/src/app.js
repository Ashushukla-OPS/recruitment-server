import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; 
import config from "./config/environment.js"; 
import userRoute from "./routes/user.route.js";
import { ApiError } from "./utils/ApiError.js";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173" || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(cookieParser()); 

app.use("/api/v1/users", userRoute);

app.use((err, req, res, next) => {

  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, err?.errors || [], err.stack);
  }


  return res.status(error.statusCode).json({
    success: error.success,
    message: error.message,
    statusCode: error.statusCode,
    errors: error.errors || []
  });
});

export default app;
