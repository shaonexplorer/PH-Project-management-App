import express from "express";
import { projectsController } from "./projects.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Define your project routes here
router.get("/", (req, res) => {
  res.send("Get all projects");
});

router.post("/create", authenticate, projectsController.createProject);
router.post("/:projectId/members", authenticate, projectsController.addMember);

// Update a single project by ID
router.put("/:id", authenticate, projectsController.updateProject);

// Delete a single project by ID
router.delete("/:id", authenticate, projectsController.deleteProject);

export const projectsRouter = router;
