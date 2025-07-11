
// Type compatibility layer for gradual migration
import { User, Project, Task, TaskComment, TeamMemberPerformance } from '@/types';

// Property name mapping utilities
export const mapDbUserToApp = (dbUser: Record<string, any>): User => ({
  id: dbUser.id,
  email: dbUser.email,
  role: dbUser.role,
  organizationId: dbUser.organization_id || dbUser.organizationId,
  name: dbUser.name,
  timezone: dbUser.timezone,
  createdAt: dbUser.created_at ? new Date(dbUser.created_at) : new Date(),
  avatar_url: dbUser.avatar_url
});

export const mapAppUserToDb = (appUser: User): Record<string, any> => ({
  id: appUser.id,
  email: appUser.email,
  role: appUser.role,
  organization_id: appUser.organizationId,
  name: appUser.name,
  timezone: appUser.timezone,
  created_at: appUser.createdAt?.toISOString(),
  avatar_url: appUser.avatar_url
});

// Project property fixes
export const fixProjectProperties = (project: Record<string, any>): Project => ({
  id: project.id || '',
  title: project.title || '',
  description: project.description,
  startDate: project.start_date || project.startDate,
  endDate: project.end_date || project.endDate,
  managerId: project.manager_id || project.managerId,
  createdAt: project.created_at || project.createdAt,
  updatedAt: project.updated_at || project.updatedAt,
  teamMemberIds: project.teamMembers || project.team_members || project.teamMemberIds || [],
  budget: project.budget,
  budgetSpent: project.budget_spent || project.budgetSpent || 0,
  isCompleted: project.is_completed || project.isCompleted || false,
  status: project.status || 'To Do',
  tasksCount: project.tasks_count || project.tasksCount || 0,
  tags: project.tags || [],
  organizationId: project.organization_id || project.organizationId || '',
  teamMembers: project.team_members || project.teamMembers || [],
  comments: project.comments || []
});

// Add missing organizationId to objects
export const addOrganizationId = <T>(obj: T, organizationId: string): T & { organizationId: string } => ({
  ...obj,
  organizationId
});

// TaskComment compatibility
export const ensureTaskCommentComplete = (comment: Partial<TaskComment>, organizationId: string): TaskComment => ({
  id: comment.id || '',
  userId: comment.userId || '',
  userName: comment.userName || 'User',
  text: comment.text || '',
  taskId: comment.taskId,
  createdAt: comment.createdAt || new Date(),
  updatedAt: comment.updatedAt,
  organizationId: comment.organizationId || organizationId
});

// TeamMemberPerformance compatibility
export const ensureTeamMemberPerformanceComplete = (
  performance: Partial<TeamMemberPerformance>, 
  organizationId: string
): TeamMemberPerformance => ({
  id: performance.id || '',
  name: performance.name || '',
  completedTasks: performance.completedTasks || 0,
  completionRate: performance.completionRate || 0,
  projects: performance.projects || 0,
  organizationId: performance.organizationId || organizationId
});

// User access utilities
export const getUserOrganizationId = (user: User | null): string => {
  return user?.organizationId || '';
};

// Safe property access
export const safeProjectAccess = {
  getTeamMembers: (project: Project): string[] => project.teamMemberIds || [],
  getTasksCount: (project: Project): number => project.tasksCount || 0,
  getIsCompleted: (project: Project): boolean => project.isCompleted || false
};
