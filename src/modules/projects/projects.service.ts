import { Request, Response } from "express";
import { prisma } from "../../app/lib/prisma";

const CreateProject = async (req: Request, res: Response) => {
  // Logic to create a new project

  const result = await prisma.project.create({ data: req.body });
  return result;
};

export const ProjectsService = {
  CreateProject,
};
