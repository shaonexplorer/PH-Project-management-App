import express from "express";
import { projectsController } from "./projects.controller";

const router = express.Router();

// Define your project routes here
router.get("/", (req, res) => {
  res.send("Get all projects");
});

router.post("/", projectsController.createProject);

export const projectsRouter = router;
