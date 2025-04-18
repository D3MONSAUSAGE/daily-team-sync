
import { User, Task, Project } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { fetchTeamMemberName } from './team';
import { fetchTaskComments } from './comments';

export const fetchProjects = async (user: User | null, setProjects: React.Dispatch<React.SetStateAction<Project[]>>) => {
  try {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('manager_id', user.id);
    
    if (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
      return;
    }
    
    if (data) {
      const formattedProjects = await Promise.all(data.map(async (project) => {
        const { data: projectTasks } = await supabase
          .from('tasks')
          .select('*')
          .eq('project_id', project.id);
        
        const formattedProjectTasks = projectTasks ? await Promise.all(projectTasks.map(async (task) => {
          // For each task, fetch its comments
          const comments = await fetchTaskComments(task.id);

          // Get assignee name if available
          let assigneeName;
          if (task.assigned_to_id) {
            assigneeName = await fetchTeamMemberName(task.assigned_to_id);
          }
          
          const formattedTask: Task = {
            id: task.id,
            userId: task.user_id || user.id, // Default to current user if null
            projectId: task.project_id || undefined,
            title: task.title || '',
            description: task.description || '',
            deadline: new Date(task.deadline || Date.now()),
            priority: (task.priority as any) || 'Medium',
            status: (task.status as any) || 'To Do',
            createdAt: new Date(task.created_at || Date.now()),
            updatedAt: new Date(task.updated_at || Date.now()),
            completedAt: task.completed_at ? new Date(task.completed_at) : undefined,
            assignedToId: task.assigned_to_id,
            assignedToName: assigneeName,
            completedById: task.completed_by_id || user.id,
            completedByName: user.name,
            comments: comments || [],
            tags: [], // Initialize as empty array
            cost: task.cost || 0,
          };
          return formattedTask;
        })) : [];
        
        return {
          id: project.id,
          title: project.title || '',
          description: project.description || '',
          startDate: new Date(project.start_date || Date.now()),
          endDate: new Date(project.end_date || Date.now()),
          managerId: project.manager_id || '',
          createdAt: new Date(project.created_at || Date.now()),
          updatedAt: new Date(project.updated_at || Date.now()),
          tasks: formattedProjectTasks,
          teamMembers: [],
          tags: [],
          budget: project.budget || 0,
          budgetSpent: project.budget_spent || 0,
          is_completed: project.is_completed || false,
        };
      }));
      
      setProjects(formattedProjects);
    }
  } catch (error) {
    console.error('Error in fetchProjects:', error);
  }
};
