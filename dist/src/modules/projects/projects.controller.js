import { ProjectsService } from "./projects.service.js";
import { catchAsync } from "../../app/utils/catch-async.js";
export const createProject = catchAsync(async (req, res) => {
    const dto = req.body;
    const creatorId = req.user?.id;
    const project = await ProjectsService.createProject(dto, creatorId);
    res.status(201).json({ project });
});
// Update a project by ID
export const updateProject = catchAsync(async (req, res) => {
    const { id } = req.params;
    const dto = req.body;
    const project = await ProjectsService.updateProject(id, dto);
    res.status(200).json({ project });
});
// Delete a project by ID
export const deleteProject = catchAsync(async (req, res) => {
    const { id } = req.params;
    const project = await ProjectsService.deleteProject(id);
    res.status(200).json({ project });
});
export const addMember = catchAsync(async (req, res) => {
    const { projectId } = req.params;
    const { name, email, password } = req.body;
    const member = await ProjectsService.addMember(projectId, {
        name,
        email,
        password,
    });
    res.status(201).json({ member });
});
/**
 * Add an existing user to a project by userId.
 */
export const addMemberByUserId = catchAsync(async (req, res) => {
    const { projectId } = req.params;
    const { userId } = req.body;
    const member = await ProjectsService.addMemberByUserId(projectId, userId);
    res.status(201).json({ member });
});
export const getUserProjects = catchAsync(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const projects = await ProjectsService.getUserProjects(userId);
    res.status(200).json({ projects });
});
/**
 * Get a single project by ID with completion percentage.
 */
export const getProject = catchAsync(async (req, res) => {
    const { id } = req.params;
    const project = await ProjectsService.getProjectById(id);
    res.status(200).json({ project });
});
/**
 * Get project completion percentage.
 */
export const getProjectCompletion = catchAsync(async (req, res) => {
    const { projectId } = req.params;
    const completionData = await ProjectsService.getProjectCompletionPercentage(projectId);
    res.status(200).json({ completionData });
});
export const projectsController = {
    // existing methods will be added after this line
    createProject,
    updateProject,
    deleteProject,
    addMember,
    addMemberByUserId,
    getUserProjects,
    getProject,
    getProjectCompletion,
};
