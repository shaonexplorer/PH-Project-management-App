import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Request, Response, NextFunction } from "express";
import { projectsRouter } from "./modules/projects/projects.routes";
import { authRouter } from "./modules/auth/auth.routes";
import { tasksRouter } from "./modules/Tasks/tasks.routes";

const app = express();

app.use(
  cors({
    origin: [],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to the Project Management App API");
});

app.use("/api/v1/projects", projectsRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tasks", tasksRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: 404,
    success: false,
    message: "Route Not Found",
  });
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", error);
  res.status(error.status || 400).json({
    status: error.status,
    success: false,
    message: error.message || "Bad Request",
    error,
  });
});

export default app;
