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
