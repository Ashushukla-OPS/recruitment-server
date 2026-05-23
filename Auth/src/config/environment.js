import dotenv from "dotenv";
const config = dotenv.config()

export default {
    SALT:process.env.SALT,
    PORT:process.env.PORT,
    MONGO_URI:process.env.MONGO_URI,
    APP_NAME:process.env.APP_NAME,
}