
import { Task } from '@/types';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface SimpleUserContext {
  id: string;
  organizationId?: string;
}

export const addTask = async (
  task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
  user: SimpleUserContext,
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  projects: any[],
  setProjects: React.Dispatch<React.SetStateAction<any[]>> | (() => Promise<void>)
): Promise<void> => {
  try {
    console.log('Adding task for user:', { userId: user.id, organizationId: user.organizationId });
    
    if (!user.organizationId) {
      console.error('User must belong to an organization to create tasks');
      toast.error('User must belong to an organization to create tasks');
      return;
    }
    
    const now = new Date();
    const taskId = uuidv4();

    const newTask = {
      ...task,
      id: taskId,
      userId: user.id,
      createdAt: now,
      updatedAt: now,
    };

    const deadlineIso = newTask.deadline instanceof Date 
      ? newTask.deadline.toISOString() 
      : new Date(newTask.deadline).toISOString();

    // Normalize assignment data for consistent storage
    let assignmentData = {};
    
    if (newTask.assignedToIds && newTask.assignedToIds.length > 0) {
      // We have multi-assignment data
      const isSingleAssignment = newTask.assignedToIds.length === 1;
      
      assignmentData = {
        assigned_to_ids: newTask.assignedToIds,
        assigned_to_names: newTask.assignedToNames || [],
        // For single assignment, also populate single field for backward compatibility
        assigned_to_id: isSingleAssignment ? newTask.assignedToIds[0] : null,
      };
    } else if (newTask.assignedToId) {
      // Legacy single assignment - normalize to both formats
      assignmentData = {
        assigned_to_id: newTask.assignedToId,
        assigned_to_ids: [newTask.assignedToId],
        assigned_to_names: newTask.assignedToName ? [newTask.assignedToName] : [],
      };
    } else {
      // No assignment
      assignmentData = {
        assigned_to_id: null,
        assigned_to_ids: [],
        assigned_to_names: [],
      };
    }
    
    const insertData = {
      id: newTask.id,
      user_id: newTask.userId,
      project_id: newTask.projectId || null,
      title: newTask.title,
      description: newTask.description,
      deadline: deadlineIso,
      priority: newTask.priority,
      status: newTask.status,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
      cost: newTask.cost || 0,
      organization_id: user.organizationId,
      ...assignmentData,
    };

    console.log('Inserting task with normalized assignment data:', insertData);

    const { data, error } = await supabase
      .from('tasks')
      .insert([insertData])
      .select();

    if (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task: ' + error.message);
      return;
    }

    console.log('Task created successfully:', data);

    setTasks([...tasks, newTask]);

    if (newTask.projectId) {
      if (typeof setProjects === 'function' && setProjects.length > 0) {
        setProjects((prevProjects: any[]) =>
          prevProjects.map((project) =>
            project.id === newTask.projectId
              ? { ...project, tasks: [...project.tasks, newTask] }
              : project
          )
        );
      } else if (typeof setProjects === 'function' && setProjects.length === 0) {
        try {
          await (setProjects as () => Promise<void>)();
        } catch (error) {
          console.error('Error refreshing projects:', error);
        }
      }
    }

    toast.success('Task added successfully!');
  } catch (error) {
    console.error('Error adding task:', error);
    toast.error('Failed to add task');
  }
};
