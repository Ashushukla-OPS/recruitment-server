

import app from "./src/app.js";

import config from "./src/config/environment.js";
import { connectDB } from "./src/config/database.js";


const { PORT } = config;

async function startServer() {
  try {
    await connectDB();
    console.log("MongoDB connected successfully");
    
    app.listen(config.PORT, () => {
      console.log(`Server running on http://localhost:${config.PORT}`);
    });
  } catch (error) {
   console.error("Server failed to start:", error);
    process.exit(1);
  }
}

startServer();




