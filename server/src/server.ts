import express, { Application } from "express";
import dotenv from "dotenv";
import Logger from "./register/logger.js";
import { applyMiddleware } from "./middleware/index.js";
import routes from "./routes/index.js";
import { connectDatabase } from "./config/database.js";
import { associateModels } from "./models/index.js";

dotenv.config();

const app: Application = express();
const PORT  = process.env.PORT ?? 3001;

// ❌ Remove this block during development
if (process.env.NODE_ENV === "production") {
  applyMiddleware(app); // ❌ Remove this line during development
}
// applyMiddleware(app);

app.use(express.json());
app.use("/api", routes);
app.use(express.static("../client/dist"));

// ✅ Start Server
const startServer = async () => {
  try {
    await connectDatabase();
    Logger.info("✅ Database connected successfully.");
    app.listen(PORT, () => Logger.info(`✅ Server is running on port ${PORT}`));
  } catch (error) {
    Logger.error("❌ Database connection failed:", error);
    process.exit(1); // Stop execution on fatal error
  }
};
associateModels();
startServer();
