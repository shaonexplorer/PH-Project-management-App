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