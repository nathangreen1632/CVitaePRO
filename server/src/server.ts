import express, { Application } from "express";
import dotenv from "dotenv";
import path from "path";
import Logger from "./register/logger.js";
import { applyMiddleware } from "./middleware/index.js";
import routes from "./routes/index.js";
import { connectDatabase, sequelize } from "./config/database.js";
import initModels from "./models/index.js";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT ?? 3001;

if (process.env.NODE_ENV === "production") {
  applyMiddleware(app);
}

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
    const models = initModels(sequelize);
    Logger.info("Models initialized.");
    app.locals.models = models; // if needed globally
    app.listen(PORT, () => Logger.info(`Server is running on port ${PORT}`));
  } catch (error) {
    Logger.error("Startup failure:", error);
    process.exit(1);
  }
};

(async () => {
  await startServer();
})();

