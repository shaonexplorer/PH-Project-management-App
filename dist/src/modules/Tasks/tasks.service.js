import { prisma } from "../../app/lib/prisma.js";
export const TasksService = {
    /**
     * Create a new task.
     */
    async createTask(dto, creatorId) {
        // Basic validation
        if (!dto.title || !dto.projectId || !dto.deadline) {
            throw new Error("Title, projectId and deadline are required");
        }
        const task = await prisma.task.create({
            data: {
                title: dto.title,
                description: dto.description,
                dueDate: new Date(dto.deadline),
                project: { connect: { id: dto.projectId } },
                ...(dto.assignedMemberId && {
                    assignee: { connect: { id: dto.assignedMemberId } },
                }),
                priority: dto.priority,
                status: dto.status,
                // No createdBy field in Task model; omit
            },
        });
        return task;
    },
    /**
     * Get a task by ID.
     */
    async getTask(id) {
        return prisma.task.findUnique({ where: { id } });
    },
    /**
     * List tasks (optional filter by project).
     */
    async listTasks(projectId) {
        const where = projectId ? { projectId } : {};
        return prisma.task.findMany({ where });
    },
    /**
     * Get all tasks under project manager.
     */
    async getTasksByUser(userId) {
        // Find projects where this user is a member
        const projects = await prisma.project.findMany({
            where: { createdBy: userId },
        });
        const projectIds = projects.map((pm) => pm.id);
        // Return tasks belonging to those projects
        return prisma.task.findMany({
            where: { projectId: { in: projectIds } },
            include: {
                assignee: { select: { id: true, name: true, email: true, role: true } },
            },
        });
    },
    /**
     * Get all tasks assigned to a specific user.
     */
    async getTasksByTeamMember(userId) {
        return prisma.task.findMany({
            where: { assignedMemberId: userId },
            include: {
                assignee: { select: { id: true, name: true, email: true, role: true } },
            },
        });
    },
    /**
     * Update an existing task.
     * Automatically updates project status to "Completed" when all tasks are done,
     * or reverts to "Active" if some tasks remain uncompleted.
     */
    async updateTask(id, dto) {
        // Ensure at least one field is provided
        if (!dto.title &&
            !dto.description &&
            !dto.deadline &&
            !dto.assignedMemberId &&
            !dto.priority &&
            !dto.status) {
            throw new Error("At least one field must be provided for update");
        }
        const data = {};
        if (dto.title)
            data.title = dto.title;
        if (dto.description)
            data.description = dto.description;
        if (dto.deadline)
            data.deadline = new Date(dto.deadline);
        if (dto.assignedMemberId)
            data.assignedMemberId = dto.assignedMemberId;
        if (dto.priority)
            data.priority = dto.priority;
        if (dto.status)
            data.status = dto.status;
        // Get the current task to find its projectId before updating
        const currentTask = await prisma.task.findUnique({ where: { id } });
        const projectId = currentTask?.projectId;
        const task = await prisma.task.update({ where: { id }, data });
        // If project exists, check if project status needs to be updated
        if (projectId) {
            const [totalTasks, completedTasks, currentProject] = await prisma.$transaction([
                prisma.task.count({ where: { projectId } }),
                prisma.task.count({
                    where: {
                        projectId,
                        status: "Completed",
                    },
                }),
                prisma.project.findUnique({ where: { id: projectId } }),
            ]);
            // If all tasks are completed, update project status to Completed
            if (completedTasks === totalTasks && totalTasks > 0) {
                if (currentProject?.status !== "Completed") {
                    await prisma.project.update({
                        where: { id: projectId },
                        data: { status: "Completed" },
                    });
                }
            }
            // If not all tasks are completed and project is Completed, revert to Active
            else if (currentProject?.status === "Completed") {
                await prisma.project.update({
                    where: { id: projectId },
                    data: { status: "Active" },
                });
            }
        }
        return task;
    },
    /**
     * Delete a task by ID.
     */
    async deleteTask(id) {
        return prisma.task.delete({ where: { id } });
    },
    /**
     * Assign a member to a task.
     * @param taskId - ID of the task to assign.
     * @param memberId - ID of the member to assign to the task.
     */
    async assignMember(taskId, memberId) {
        // Ensure both task and member exist could be added here.
        // Update the task's assignee relationship.
        return prisma.task.update({
            where: { id: taskId },
            data: { assignee: { connect: { id: memberId } } },
        });
    },
};
