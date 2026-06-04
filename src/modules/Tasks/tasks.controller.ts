import { Request, Response, NextFunction } from "express";
import { TasksService } from "./tasks.service";
import { catchAsync } from "../../app/utils/catch-async";
import { CreateTaskDto, UpdateTaskDto } from "./tasks.dto";

// Create a new task
export const createTask = catchAsync(async (req: Request, res: Response) => {
  const dto: CreateTaskDto = req.body;
  // Optionally, you could capture creatorId from auth middleware if needed
  const task = await TasksService.createTask(dto);
  res.status(201).json({ task });
});

// Get a single task by ID
export const getTask = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const task = await TasksService.getTask(id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.status(200).json({ task });
});

// List tasks, optionally filtered by projectId via query param
export const listTasks = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.query as { projectId?: string };
  const tasks = await TasksService.listTasks(projectId);
  res.status(200).json({ tasks });
});

// Update a task
export const updateTask = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const dto: UpdateTaskDto = req.body;
  const task = await TasksService.updateTask(id, dto);
  res.status(200).json({ task });
});

// Delete a task
export const deleteTask = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const task = await TasksService.deleteTask(id);
  res.status(200).json({ task });
});

export const tasksController = {
  createTask,
  getTask,
  listTasks,
  updateTask,
  deleteTask,
};
