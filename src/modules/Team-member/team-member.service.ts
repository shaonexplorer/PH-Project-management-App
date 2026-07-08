// src/modules/team-member/team-member.service.ts
import { prisma } from "../../app/lib/prisma.js";
import { hashPassword } from "../../utils/password.js";

/**
 * Service layer for Team Member (User) operations.
 * Uses the Prisma `User` model. Team members have the role `Team_Member`.
 */
export const TeamMemberService = {
  /** List all team members */
  async listMembers() {
    return prisma.user.findMany({
      where: { role: "Team_Member" as any },
    });
  },

  /** Get a single member by ID */
  async getMember(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  /** Create a new team member */
  async createMember(dto: { name: string; email: string; password: string }) {
    const passwordHash = await hashPassword(dto.password);
    return prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        role: "Team_Member" as any,
      },
    });
  },

  /** Update an existing member */
  async updateMember(
    id: string,
    dto: { name?: string; email?: string; password?: string },
  ) {
    const data: any = {};
    if (dto.name) data.name = dto.name;
    if (dto.email) data.email = dto.email;
    if (dto.password) data.passwordHash = await hashPassword(dto.password);
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  /** Delete a member by ID */
  async deleteMember(id: string) {
    return prisma.user.delete({ where: { id } });
  },

  /** Get team members for a specific project */
  async getMembersByProjectId(projectId: string) {
    // Assuming a ProjectMember model linking users to projects
    return prisma.projectMember.findMany({
      where: { projectId },
      // Include user details for convenience
      include: { user: true },
    });
  },
};
