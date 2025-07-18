
export type UserRole = 'superadmin' | 'admin' | 'manager' | 'user';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  organizationId: string;
  name?: string;
  timezone?: string;
  createdAt: Date;
  avatar_url?: string;
}

export type TaskPriority = 'Low' | 'Medium' | 'High';

export type TaskStatus = 'To Do' | 'In Progress' | 'Completed';

export interface TaskComment {
  id: string;
  text: string;
  userId: string;
  userName?: string;
  taskId?: string;
  projectId?: string;
  createdAt: Date;
  updatedAt?: Date;
  category?: string;
  isPinned?: boolean;
  metadata?: Record<string, any>;
  organizationId: string;
}

export type Comment = TaskComment;

export interface Task {
  id: string;
  userId: string;
  projectId?: string;
  title: string;
  description: string;
  deadline: Date;
  scheduledStart?: Date;
  scheduledEnd?: Date;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  assignedToId?: string;
  assignedToName?: string;
  assignedToIds?: string[];
  assignedToNames?: string[];
  completedById?: string;
  completedByName?: string;
  tags?: string[];
  comments?: TaskComment[];
  cost?: number;
  organizationId: string;
}

export type ProjectStatus = 'To Do' | 'In Progress' | 'Completed';

export interface Project {
  id: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  managerId?: string;
  createdAt?: string;
  updatedAt?: string;
  teamMemberIds?: string[];
  budget?: number;
  budgetSpent?: number;
  isCompleted?: boolean;
  status?: 'To Do' | 'In Progress' | 'Completed' | 'On Hold';
  tasksCount?: number;
  tags?: string[];
  organizationId?: string;
  teamMembers?: string[];
  comments?: TaskComment[];
}

export interface DailyScore {
  completedTasks: number;
  totalTasks: number;
  percentage: number;
  date: Date;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  managerId: string;
  organizationId: string;
}

export interface TeamMemberPerformance {
  id: string;
  name: string;
  completedTasks: number;
  completionRate: number;
  projects: number;
  organizationId: string;
}

export interface Organization {
  id: string;
  name: string;
  created_by: string;
  created_at: Date;
}

export interface ChatRoom {
  id: string;
  name: string;
  created_by: string;
  created_at: Date;
  organizationId: string;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  type: 'text' | 'file' | 'image';
  created_at: Date;
  parent_id?: string;
  organizationId: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  content?: string;
  type: string;
  read: boolean;
  created_at: Date;
  task_id?: string;
  event_id?: string;
  organizationId: string;
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  file_path: string;
  file_type: string;
  size_bytes: number;
  user_id: string;
  folder?: string;
  storage_id: string;
  created_at: Date;
  organizationId: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  start_date: Date;
  end_date: Date;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  organizationId: string;
}

export interface TimeEntry {
  id: string;
  user_id: string;
  clock_in: Date;
  clock_out?: Date;
  duration_minutes?: number;
  notes?: string;
  created_at: Date;
  organizationId: string;
}

// Role hierarchy utility functions
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  'superadmin': 4,
  'admin': 3,
  'manager': 2,
  'user': 1
};

export const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case 'superadmin':
      return 'Super Admin';
    case 'admin':
      return 'Admin';
    case 'manager':
      return 'Manager';
    case 'user':
      return 'Team Member';
    default:
      return 'Unknown';
  }
};
