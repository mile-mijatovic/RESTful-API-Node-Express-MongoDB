import express, { Application } from "express";
import cors from "cors";
import session from "express-session";

// Routes
import contactRoutes from "./routes/contacts.route";
import profileRoutes from "./routes/profile.route";
import userRoutes from "./routes/user.route";

import config from "./config/env";
import { connectToDatabase, store } from "./config/mongo";
import { errorHandler, notFoundHandler } from "./middleware";

const app: Application = express();
const PORT = config.port;
const isProduction = process.env.NODE_ENV === "production";

const startServer = async () => {
  await connectToDatabase();

  app.use(express.json());
  app.set("trust proxy", 1);
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));

  // Configure CORS
  app.use(
    cors({
      credentials: true,
      // TODO: Update production origin url
      origin: isProduction ? "*" : "http://localhost:3000",
    })
  );

  // Configure session
  app.use(
    session({
      name: config.session.name,
      secret: config.session.secret as string,
      resave: false,
      saveUninitialized: false,
      store,
      cookie: {
        httpOnly: isProduction,
        secure: isProduction,
        maxAge: 15 * 60 * 1000,
      },
    })
  );

  app.use("/api/user", userRoutes);
  app.use("/api/contacts", contactRoutes);
  app.use("/api/profile", profileRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  process.on("unhandledRejection", (error) =>
    console.warn("Unhandled Rejection", error)
  );

  process.on("uncaughtException", (error) =>
    console.warn("Uncaught Exception", error)
  );

  app.on("error", (error: any) => {
    switch (error.code) {
      case "EACCES":
        console.error(`${config.port} requires elevated privileges`);
        break;

      case "EADDRINUSE":
        console.error(`${config.port} is already in use.`);
        break;

      default:
        throw error;
    }
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
};

startServer();
