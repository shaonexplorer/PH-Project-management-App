import { NextFunction, Request, Response } from "express";
import { ProjectsService } from "./projects.service.js";
import { catchAsync } from "../../app/utils/catch-async.js";

import { CreateProjectDto } from "./projects.dto.js";

export const createProject = catchAsync(async (req: Request, res: Response) => {
  const dto: CreateProjectDto = req.body;
  const creatorId = (req as any).user?.id;
  const project = await ProjectsService.createProject(dto, creatorId);
  res.status(201).json({ project });
});

import { UpdateProjectDto } from "./projects.dto";

// Update a project by ID
export const updateProject = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const dto: UpdateProjectDto = req.body;
  const project = await ProjectsService.updateProject(id, dto);
  res.status(200).json({ project });
});

// Delete a project by ID
export const deleteProject = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const project = await ProjectsService.deleteProject(id);
  res.status(200).json({ project });
});

import { AddProjectMemberDto } from "./projects.dto";

export const addMember = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { name, email, password } = req.body as AddProjectMemberDto;
  const result = await ProjectsService.addMember(projectId, {
    name,
    email,
    password,
  });
  res.status(201).json({ projectMember: result.projectMember, projectManagerMembers: result.projectManagerMembers });
});

/**
 * Add an existing user to a project by userId.
 */
export const addMemberByUserId = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { userId } = req.body as { userId: string };
  const result = await ProjectsService.addMemberByUserId(projectId, userId);
  res.status(201).json({ projectMember: result.projectMember, projectManagerMembers: result.projectManagerMembers });
});

export const getUserProjects = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const projects = await ProjectsService.getUserProjects(userId);
  res.status(200).json({ projects });
});

/**
 * Get a single project by ID with completion percentage.
 */
export const getProject = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const project = await ProjectsService.getProjectById(id);
  res.status(200).json({ project });
});

/**
 * Get project completion percentage.
 */
export const getProjectCompletion = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const completionData = await ProjectsService.getProjectCompletionPercentage(projectId);
  res.status(200).json({ completionData });
});

/**
 * Get all members assigned to a specific Project Manager.
 * Optionally excludes members already assigned to a specific project.
 */
export const getMembersByProjectManager = catchAsync(
  async (req: Request, res: Response) => {
    const { managerId } = req.params;
    const { projectId } = req.query;
    const members = await ProjectsService.getMembersByProjectManager(
      managerId,
      projectId as string | undefined,
    );
    res.status(200).json({ members });
  }
);

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
  getMembersByProjectManager,
};
