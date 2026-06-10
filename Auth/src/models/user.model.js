import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import config from "../config/environment.js";
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      index: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      index: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

/**
 * Hash password before save
 */
userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) return next();
        this.password = await bcrypt.hash(this.password, config.SALT);
});


/**
 *  Compare password
 */
 userSchema.methods.comparePassword = async function (plainPassword){
        return  bcrypt.compare(plainPassword, this.password )
}

export const User = mongoose.model("User", userSchema);
