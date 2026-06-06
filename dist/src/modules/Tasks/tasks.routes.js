import express from "express";
import { tasksController } from "./tasks.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
const router = express.Router();
// Create a new task (protected)
router.post("/", authenticate, tasksController.createTask);
// Get a single task by ID
router.get("/:id", tasksController.getTask);
// List tasks (optional projectId query param)
router.get("/", tasksController.listTasks);
// Update a task (protected)
router.put("/:id", authenticate, tasksController.updateTask);
// Delete a task (protected)
router.delete("/:id", authenticate, tasksController.deleteTask);
// Assign a member to a task (protected)
router.patch("/:taskId/assign/:memberId", authenticate, tasksController.assignMember);
export const tasksRouter = router;
