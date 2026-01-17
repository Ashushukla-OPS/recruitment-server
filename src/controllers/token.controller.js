import TokenService from "../services/token.service.js";

class TokenController {
  constructor() {
    this.tokenController = new TokenService();
  }

  createToken = async (req, res, next) => {
    try {
      const userId = req.userId;

      const response = await this.tokenController.createToken(userId);


      res.cookie("token", response.token, {
        ...this.cookieOptions,
        maxAge: 60 * 60 * 1000,

      });

      res.cookie("refreshToken", response.refreshToken, {
        ...this.cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        success: true,
        message: "Token update successfully.",
        data: response
      });
    } catch (error) {
      next(error);
    }
  };
}

export default TokenController;
