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
     * Update an existing task.
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
        const task = await prisma.task.update({ where: { id }, data });
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
