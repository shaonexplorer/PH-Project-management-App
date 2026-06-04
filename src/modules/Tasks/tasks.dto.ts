export interface CreateTaskDto {
  projectId: string;
  title: string;
  description?: string;
  deadline: string; // ISO date string
  assignedMemberId?: string;
  priority?: 'Low' | 'Medium' | 'High';
  status?: 'Todo' | 'In_Progress' | 'Completed';
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  deadline?: string; // ISO date string
  assignedMemberId?: string;
  priority?: 'Low' | 'Medium' | 'High';
  status?: 'Todo' | 'In_Progress' | 'Completed';
}