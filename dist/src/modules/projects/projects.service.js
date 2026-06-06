import { prisma } from "../../app/lib/prisma";
import { hashPassword } from "../../utils/password";
export const ProjectsService = {
    /**
     * Add a member to a project.
     * @param projectId ID of the project
     * @param dto object containing userId to add
     */
    async addMember(projectId, dto) {
        const { name, email, password } = dto;
        // Perform all operations atomically within a transaction
        const member = await prisma.$transaction(async (tx) => {
            // Validate project exists
            const project = await tx.project.findUnique({ where: { id: projectId } });
            if (!project) {
                throw new Error('Project not found');
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
                        role: 'Team_Member',
                    },
                });
            }
            // Check for existing membership
            const existing = await tx.projectMember.findUnique({
                where: { projectId_userId: { projectId, userId: user.id } },
            });
            if (existing) {
                throw new Error('User is already a member of this project');
            }
            // Create the membership record
            return await tx.projectMember.create({
                data: { projectId, userId: user.id },
            });
        });
        return member;
    },
    /**
     * Create a new project.
     * @param dto Data Transfer Object with project fields
     * @param creatorId Optional user ID of the creator (from auth middleware)
     */
    async createProject(dto, creatorId) {
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
    async updateProject(id, dto) {
        // Basic validation: ensure at least one updatable field is present
        if (!dto.name && !dto.description && !dto.deadline) {
            throw new Error("At least one field (name, description, deadline) must be provided");
        }
        const data = {};
        if (dto.name)
            data.name = dto.name;
        if (dto.description)
            data.description = dto.description;
        if (dto.deadline)
            data.deadline = new Date(dto.deadline);
        const project = await prisma.project.update({
            where: { id },
            data,
        });
        return project;
    },
    /**
     * Delete a project by its ID.
     */
    async deleteProject(id) {
        const project = await prisma.project.delete({ where: { id } });
        return project;
    },
};
