// src/modules/team-member/team-member.router.ts
import express from "express";
import { teamMemberController } from "./team-member.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = express.Router();

// List all team members
router.get("/", authenticate, teamMemberController.listMembers);
// Get team members for a specific project
router.get("/project/:projectId/members", authenticate, teamMemberController.getMembersByProjectId);

// Get members by Project Manager (with optional project exclusion)
router.get("/manager/:managerId/members", authenticate, teamMemberController.getMembersByProjectManager);

// Get a single team member by ID
router.get("/:id", authenticate, teamMemberController.getMember);

// Create a new team member
router.post("/", authenticate, teamMemberController.createMember);

// Update a team member
router.put("/:id", authenticate, teamMemberController.updateMember);

// Delete a team member
router.delete("/:id", authenticate, teamMemberController.deleteMember);

export const teamMemberRouter = router;
