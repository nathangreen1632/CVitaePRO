import express, { Application } from "express";
import dotenv from "dotenv";
import path from "path";
import Logger from "./register/logger.js";
import { applyMiddleware } from "./middleware/index.js";
import routes from "./routes/index.js";
import { connectDatabase } from "./config/database.js";
import { associateModels } from "./models/index.js";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT ?? 3001;

if (process.env.NODE_ENV === "production") {
  applyMiddleware(app);
}

// Middlewares
app.use(express.json());

const __dirname = path.resolve();
const clientDistPath = path.resolve(__dirname, "../client/dist");
app.use(express.static(clientDistPath));

app.use("/api", routes);

app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(clientDistPath, "index.html"));
  }
});

const startServer = async () => {
  try {
    await connectDatabase();
    Logger.info("Database connected successfully.");
    app.listen(PORT, () => Logger.info(`Server is running on port ${PORT}`));
  } catch (error) {
    Logger.error("Database connection failed:", error);
    process.exit(1);
  }
};

associateModels();
startServer();
