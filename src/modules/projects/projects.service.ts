import { prisma } from "../../app/lib/prisma";
import { CreateProjectDto, UpdateProjectDto } from "./projects.dto";

export const ProjectsService = {
  /**
   * Create a new project.
   * @param dto Data Transfer Object with project fields
   * @param creatorId Optional user ID of the creator (from auth middleware)
   */
  async createProject(dto: CreateProjectDto, creatorId?: string) {
    // Basic validation
    if (!dto.name || !dto.deadline) {
      throw new Error("Name and deadline are required");
    }

    const project = await prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        deadline: new Date(dto.deadline),
        ...(creatorId && { createdBy: creatorId }),
      },
    });
    return project;
  },

  /**
   * Update an existing project by its ID.
   * Allows partial updates; only provided fields are changed.
   */
  async updateProject(id: string, dto: UpdateProjectDto) {
    // Basic validation: ensure at least one updatable field is present
    if (!dto.name && !dto.description && !dto.deadline) {
      throw new Error(
        "At least one field (name, description, deadline) must be provided",
      );
    }

    const data: any = {};
    if (dto.name) data.name = dto.name;
    if (dto.description) data.description = dto.description;
    if (dto.deadline) data.deadline = new Date(dto.deadline);

    const project = await prisma.project.update({
      where: { id },
      data,
    });
    return project;
  },
  /**
   * Delete a project by its ID.
   */
  async deleteProject(id: string) {
    const project = await prisma.project.delete({ where: { id } });
    return project;
  },
};
