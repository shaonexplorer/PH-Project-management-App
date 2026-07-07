import { prisma } from "../../app/lib/prisma.js";
import { hashPassword } from "../../utils/password.js";
import { CreateProjectDto, UpdateProjectDto } from "./projects.dto.js";

export const ProjectsService = {
  /**
   * Add a member to a project.
   * @param projectId ID of the project
   * @param dto object containing userId to add
   */
  async addMember(
    projectId: string,
    dto: { name: string; email: string; password: string },
  ) {
    const { name, email, password } = dto;
    // Perform all operations atomically within a transaction
    const member = await prisma.$transaction(async (tx) => {
      // Validate project exists
      const project = await tx.project.findUnique({ where: { id: projectId } });
      if (!project) {
        throw new Error("Project not found");
      }

      // Find or create the user
      let user = await tx.user.findUnique({ where: { email } });
      if (!user) {
        const passwordHash = await hashPassword(password);
        user = await tx.user.create({
          data: {
            name,
            email,
            passwordHash,
            role: "Team_Member" as any,
          },
        });
      }

      // Check for existing membership
      const existing = await tx.projectMember.findUnique({
        where: { projectId_userId: { projectId, userId: user.id } },
      });
      if (existing) {
        throw new Error("User is already a member of this project");
      }

      // Create the membership record
      return await tx.projectMember.create({
        data: { projectId, userId: user.id, name: user.name },
      });
    });
    return member;
  },

  /**
   * Add an existing user to a project by userId.
   * @param projectId ID of the project
   * @param userId ID of the existing user to add
+   * @returns the created projectMember record
   */
  async addMemberByUserId(projectId: string, userId: string) {
    const member = await prisma.$transaction(async (tx) => {
      // Validate project exists
      const project = await tx.project.findUnique({ where: { id: projectId } });
      if (!project) {
        throw new Error("Project not found");
      }

      // Fetch the user to get the name
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new Error("User not found");
      }

      // Check for existing membership
      const existing = await tx.projectMember.findUnique({
        where: { projectId_userId: { projectId, userId: user.id } },
      });
      if (existing) {
        throw new Error("User is already a member of this project");
      }

      // Create the membership record
      return await tx.projectMember.create({
        data: { projectId, userId: user.id, name: user.name },
      });
    });
    return member;
  },

  /**
   * Get all projects with completion percentage.
   * Returns an array of project records with task counts and completion data.
   */
  async getAllProjects() {
    const projects = await prisma.project.findMany({
      include: {
        members: true,
      },
    });

    // Get completion percentage for each project
    const projectsWithCompletion = await Promise.all(
      projects.map(async (project) => {
        const completionData = await this.getProjectCompletionPercentage(project.id);
        return {
          ...project,
          completionPercentage: completionData.completionPercentage,
          totalTasks: completionData.totalTasks,
          completedTasks: completionData.completedTasks,
        };
      }),
    );

    return projectsWithCompletion;
  },

  /**
   * Get projects for the logged‑in user.
   * Returns projects where the user is the creator or a member,
   * with completion percentage included.
   */
  async getUserProjects(userId: string) {
    const projects = await prisma.project.findMany({
      where: {
        OR: [{ createdBy: userId }, { members: { some: { userId } } }],
      },
      include: { members: true },
    });

    // Get completion percentage for each project
    const projectsWithCompletion = await Promise.all(
      projects.map(async (project) => {
        const completionData = await this.getProjectCompletionPercentage(project.id);
        return {
          ...project,
          completionPercentage: completionData.completionPercentage,
          totalTasks: completionData.totalTasks,
          completedTasks: completionData.completedTasks,
        };
      }),
    );

    return projectsWithCompletion;
  },

  /**
   * Create a new project.
   * @param dto Data Transfer Object with project fields
   * @param creatorId Optional user ID of the creator (from auth middleware)
   */
  async createProject(
    dto: CreateProjectDto & { memberId?: string; memberName?: string },
    creatorId?: string,
  ) {
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

    // If a memberId is provided, add the user as a project member
    if (dto.memberId) {
      const member = await prisma.user.findFirst({
        where: { id: dto.memberId },
      });

      if (!member) {
        throw Error("Member with the provided id not found");
      }

      await prisma.projectMember.create({
        data: {
          projectId: project.id,
          userId: dto.memberId,
          name: member?.name,
        },
      });
    }

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

  /**
   * Get project completion percentage.
   * Calculated as (completed tasks / total tasks) * 100.
   * Automatically updates project status to "Completed" when 100% done.
   * @param projectId ID of the project
   */
  async getProjectCompletionPercentage(projectId: string) {
    // Validate project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new Error("Project not found");
    }

    // Get total tasks count and completed tasks count
    const [totalTasks, completedTasks] = await prisma.$transaction([
      prisma.task.count({ where: { projectId } }),
      prisma.task.count({
        where: {
          projectId,
          status: "Completed",
        },
      }),
    ]);

    // Handle edge case of no tasks
    if (totalTasks === 0) {
      return {
        projectId,
        totalTasks: 0,
        completedTasks: 0,
        completionPercentage: 0,
      };
    }

    const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

    // Update project status to Completed if 100% done and not already completed
    if (completionPercentage === 100 && project.status !== "Completed") {
      await prisma.project.update({
        where: { id: projectId },
        data: { status: "Completed" },
      });
    }

    return {
      projectId,
      totalTasks,
      completedTasks,
      completionPercentage,
    };
  },

  /**
   * Get a single project by ID with completion percentage included.
   */
  async getProjectById(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        members: true,
        _count: {
          select: { tasks: true },
        },
      },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    // Get completion percentage
    const completionData = await this.getProjectCompletionPercentage(id);

    return {
      ...project,
      completionPercentage: completionData.completionPercentage,
      totalTasks: completionData.totalTasks,
      completedTasks: completionData.completedTasks,
    };
  },
};
