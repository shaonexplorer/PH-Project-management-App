// src/modules/team-member/team-member.controller.ts
import { Request, Response } from "express";
import { catchAsync } from "../../app/utils/catch-async.js";
import { TeamMemberService } from "./team-member.service.js";

/** List all team members */
export const listMembers = catchAsync(async (req: Request, res: Response) => {
  const members = await TeamMemberService.listMembers();
  res.status(200).json({ members });
});

/** Get a single member by ID */
export const getMember = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const member = await TeamMemberService.getMember(id);
  if (!member) {
    return res.status(404).json({ message: "Team member not found" });
  }
  res.status(200).json({ member });
});

/** Get team members for a specific project */
export const getMembersByProjectId = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const members = await TeamMemberService.getMembersByProjectId(projectId);
  res.status(200).json({ members });
});

/**
 * Get all members under a specific Project Manager.
 * Optionally exclude members already assigned to a specific project.
 */
export const getMembersByProjectManager = catchAsync(
  async (req: Request, res: Response) => {
    const { managerId } = req.params;
    const { excludeProjectId } = req.query;
    const members = await TeamMemberService.getMembersByProjectManager(
      managerId,
      excludeProjectId as string | undefined,
    );
    res.status(200).json({ members });
  }
);

/** Create a new team member */
export const createMember = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "name, email and password are required" });
  }
  const member = await TeamMemberService.createMember({ name, email, password });
  res.status(201).json({ member });
});

/** Update an existing team member */
export const updateMember = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  const updated = await TeamMemberService.updateMember(id, { name, email, password });
  res.status(200).json({ member: updated });
});

/** Delete a team member */
export const deleteMember = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await TeamMemberService.deleteMember(id);
  res.status(204).send();
});

export const teamMemberController = {
  listMembers,
  getMember,
  getMembersByProjectId,
  getMembersByProjectManager,
  createMember,
  updateMember,
  deleteMember,
};
