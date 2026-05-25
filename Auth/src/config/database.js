import mongoose from "mongoose";
import config from "./environment.js";

export async function connectDB() {
    await mongoose.connect(`${config.MONGO_URI}${config.APP_NAME}`);
}
