import { TasksService } from "./tasks.service";
import { catchAsync } from "../../app/utils/catch-async";
// Create a new task
export const createTask = catchAsync(async (req, res) => {
    const dto = req.body;
    // Optionally, you could capture creatorId from auth middleware if needed
    const task = await TasksService.createTask(dto);
    res.status(201).json({ task });
});
// Get a single task by ID
export const getTask = catchAsync(async (req, res) => {
    const { id } = req.params;
    const task = await TasksService.getTask(id);
    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ task });
});
// List tasks, optionally filtered by projectId via query param
export const listTasks = catchAsync(async (req, res) => {
    const { projectId } = req.query;
    const tasks = await TasksService.listTasks(projectId);
    res.status(200).json({ tasks });
});
// Update a task
export const updateTask = catchAsync(async (req, res) => {
    const { id } = req.params;
    const dto = req.body;
    const task = await TasksService.updateTask(id, dto);
    res.status(200).json({ task });
});
// Delete a task
export const deleteTask = catchAsync(async (req, res) => {
    const { id } = req.params;
    const task = await TasksService.deleteTask(id);
    res.status(200).json({ task });
});
/**
 * Assign a member to a task.
 * Expects taskId and memberId as URL params.
 */
export const assignMember = catchAsync(async (req, res) => {
    const { taskId, memberId } = req.params;
    const task = await TasksService.assignMember(taskId, memberId);
    res.status(200).json({ task });
});
export const tasksController = {
    createTask,
    getTask,
    listTasks,
    updateTask,
    deleteTask,
    assignMember,
};
