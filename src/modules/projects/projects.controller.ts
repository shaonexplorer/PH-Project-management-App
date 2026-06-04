import { NextFunction, Request, Response } from "express";
import { ProjectsService } from "./projects.service";
import { catchAsync } from "../../app/utils/catch-async";

const createProject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Logic to create a new project

    const result = await ProjectsService.CreateProject(req, res);

    res.status(201).json({ message: "Project created successfully" });
  },
);

export const projectsController = {
  createProject,
};
