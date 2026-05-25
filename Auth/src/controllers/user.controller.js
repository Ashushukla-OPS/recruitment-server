import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

import zod from "zod";
import { userService } from "../services/user.service.js";
import { User } from "../models/user.model.js";

class userController {
  constructor() {
    this.userService = new userService();

    this.getMe = this.getMe.bind(this);
    this.updateMe = this.updateMe.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.createUser = this.createUser.bind(this);
  }
  getMe = asyncHandler(async (req, res, next) => {
    const { id, email } = req.body;
    if (!id && !email) throw new ApiError(400, "Both field are required.");
    const user = await this.userService.getAllUser();

    if (user) {
      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { message: "All the user data featch successfully." },
            user,
          ),
        );
    }
    throw new ApiError(404, "Datas not found!");
  });

  updateMe = asyncHandler(async (req, res, next) => {
    const { id, username } = req.params;
    if (!id && !username) throw new ApiError(400, "Both field are required.");
    const updatedUser = await this.userService.updateUserById(id, username);
    if (!updatedUser)
      throw new ApiError(404, "This user of Id not available in the DB");
    return res
      .status(200)
      .json(
        new ApiResponse(200, { message: "Username updated." }, updatedUser),
      );
  });

  deleteUser = asyncHandler(async (req, res, next) => {
    const { id, email } = req.params;
    if (id && email)
      throw new ApiError(400, "Atlist id or email need to delete data.");

    const deleteUser = await this.userService.deleteUserByIdOrEmail(id, email);
    return res
      .status(200)
      .json(new ApiResponse(200, { message: "Deleted user" }, deleteUser));
  });

  createUser = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, username, email, password } = req.body;
    const findUser = await this.userService.userRegister({
      firstName,
      lastName,
      username,
      email,
      password,
    });
    if (!findUser) throw new ApiError(400, "register field");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { message: "register successfully", success: true },
          findUser,
        ),
      );
  });
}

export default new userController