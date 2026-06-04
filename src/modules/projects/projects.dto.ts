export interface CreateProjectDto {
  name: string;
  description?: string;
  deadline: string; // ISO date string
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  deadline?: string; // ISO date string
}

export interface AddProjectMemberDto {
  name: string;
  email: string;
  password: string;
}
