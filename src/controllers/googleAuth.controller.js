import jwt from "jsonwebtoken";
import { handleGoogleLogin } from "../services/googleAuth.service.js";

export const googleCallback = async (req, res) => {
  try {
    const user = req.user;

    const dbUser = await handleGoogleLogin(user);

    const token = jwt.sign(
      {
        id: dbUser._id,
        email: dbUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    const redirectUrl = `http://localhost:3000`;
    return res.redirect(redirectUrl);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
