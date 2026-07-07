import express from "express";
import { projectsController } from "./projects.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Define your project routes here
router.get("/", async (_req, res) => {
  // Optional: return all projects (public)
  const projects = await import('./projects.service.js').then(m => m.ProjectsService.getAllProjects());
  res.status(200).json({ projects });
});

// Get projects for the authenticated user
router.get("/my", authenticate, projectsController.getUserProjects);

// Get a single project by ID with completion percentage
router.get("/:id", authenticate, projectsController.getProject);

// Get project completion percentage
router.get("/:projectId/completion", authenticate, projectsController.getProjectCompletion);

router.post("/create", authenticate, projectsController.createProject);
router.post("/:projectId/members", authenticate, projectsController.addMember);
router.post("/:projectId/members/user", authenticate, projectsController.addMemberByUserId);

// Update a single project by ID
router.put("/:id", authenticate, projectsController.updateProject);

// Delete a single project by ID
router.delete("/:id", authenticate, projectsController.deleteProject);

export const projectsRouter = router;
