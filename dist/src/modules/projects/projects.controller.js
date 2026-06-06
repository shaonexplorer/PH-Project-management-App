import { ProjectsService } from "./projects.service";
import { catchAsync } from "../../app/utils/catch-async";
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
export const projectsController = {
    // existing methods will be added after this line
    createProject,
    updateProject,
    deleteProject,
    addMember,
};
