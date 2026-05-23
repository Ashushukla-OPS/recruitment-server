import express from "express";
import userController from "../controllers/user.controller.js";

const route = express.Router();

route.get("/me", userController.getMe);
route.patch("/user", userController.updateMe);
route.delete("/delete", userController.deleteUser);
route.post("/register", userController.createUser);

export default route
