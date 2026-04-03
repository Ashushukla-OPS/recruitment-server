import jwt from "jsonwebtoken";

export const googleAuthCallback = (req, res) => {
  try {
    const user = req.user;

    const token = jwt.sign(
      {
        id:         user._id,
        email:      user.email,
        firstName:  user.firstName,
        lastName:   user.lastName,
        isVerified: user.isVerified,
        role:       user.roleId,   
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  } catch (err) {
    res.status(500).json({ message: "Auth failed", error: err.message });
  }
};

export const authFailed = (req, res) => {
  res.status(401).json({ success: false, message: "Google authentication failed" });
};

export const getMe = (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};