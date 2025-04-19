import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project, Task } from '@/types';
import { Badge } from "@/components/ui/badge";
import { Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from 'lucide-react';
import { useTask } from '@/contexts/task';
import { ScrollArea } from "@/components/ui/scroll-area";
import TaskPreview from './task/TaskPreview';
import ProjectMetadata from './project/ProjectMetadata';
import ProjectTaskProgress from './project/ProjectTaskProgress';
import ProjectBudget from './project/ProjectBudget';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onViewTasks?: (project: Project) => void;
  onCreateProject: () => void;
  onCreateTask?: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onEdit, 
  onViewTasks, 
  onCreateTask 
}) => {
  const { deleteProject, updateProject, fetchProjects } = useTask();
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (project.tasks && project.tasks.length > 0) {
      console.log(`ProjectCard: Using ${project.tasks.length} tasks from project prop for ${project.id}`);
      setProjectTasks(project.tasks);
    } else {
      fetchProjectTasks();
    }
  }, [project.id, project.tasks]);
  
  const fetchProjectTasks = async () => {
    if (!project.id) return;
    
    setIsLoading(true);
    try {
      console.log(`ProjectCard: Fetching tasks for project ID: ${project.id}`);
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', project.id);
        
      if (error) {
        console.error('Error fetching project tasks:', error);
        toast.error('Failed to load project tasks');
        return;
      }
      
      console.log(`ProjectCard: Found ${data?.length || 0} tasks for project ${project.id}`, data);
      
      if (data) {
        const mappedTasks: Task[] = data.map(task => ({
          id: task.id,
          userId: task.user_id || '',
          projectId: task.project_id || undefined,
          title: task.title || '',
          description: task.description || '',
          deadline: new Date(task.deadline || Date.now()),
          priority: task.priority as Task['priority'] || 'Medium',
          status: task.status as Task['status'] || 'To Do',
          createdAt: new Date(task.created_at || Date.now()),
          updatedAt: new Date(task.updated_at || Date.now()),
          completedAt: task.completed_at ? new Date(task.completed_at) : undefined,
          assignedToId: task.assigned_to_id || undefined,
          assignedToName: task.assigned_to_name || undefined,
          tags: [],
          comments: [],
          cost: task.cost || 0
        }));
        setProjectTasks(mappedTasks);
      }
    } catch (error) {
      console.error('Error fetching project tasks:', error);
      toast.error('Failed to load project tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleCompletion = () => {
    updateProject(project.id, { is_completed: !project.is_completed });
  };
  
  const handleViewTasks = () => {
    if (onViewTasks) {
      onViewTasks(project);
    }
  };
  
  const handleCreateTask = () => {
    if (onCreateTask) {
      fetchProjects();
      onCreateTask(project);
    }
  };
  
  return (
    <Card className={`relative overflow-hidden ${project.is_completed ? 'bg-gray-50' : ''}`}>
      <CardHeader className="pb-1 md:pb-2 flex flex-row justify-between items-start gap-2">
        <div className="min-w-0 flex items-center gap-2">
          <CardTitle className="text-sm md:text-base text-ellipsis overflow-hidden whitespace-nowrap">
            {project.title}
          </CardTitle>
          {project.is_completed && (
            <Badge variant="secondary">Completed</Badge>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 flex-shrink-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="text-xs md:text-sm">
            <DropdownMenuItem onClick={() => onEdit && onEdit(project)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleViewTasks}>
              View Tasks
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleToggleCompletion}>
              {project.is_completed ? 'Mark as Active' : 'Mark as Completed'}
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-500" 
              onClick={() => deleteProject(project.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="space-y-2 pt-0 md:pt-1 px-4 md:px-6 pb-4">
        <p className="text-xs md:text-sm text-gray-600 line-clamp-2 min-h-[2rem]">
          {project.description}
        </p>
        
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : projectTasks.length > 0 ? (
          <div className="mt-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium">Recent Tasks</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs"
                onClick={handleViewTasks}
              >
                View All
              </Button>
            </div>
            <ScrollArea className="h-[120px]">
              {projectTasks.slice(0, 3).map((task) => (
                <TaskPreview 
                  key={task.id} 
                  task={task} 
                  onClick={handleViewTasks}
                />
              ))}
            </ScrollArea>
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-xs text-gray-500">No tasks yet</p>
          </div>
        )}

        <ProjectMetadata 
          startDate={project.startDate} 
          endDate={project.endDate}
          tasks={projectTasks}
        />
        
        <ProjectTaskProgress tasks={projectTasks} />
        
        {project.budget && (
          <ProjectBudget 
            budget={project.budget} 
            budgetSpent={project.budgetSpent || 0} 
          />
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-1 md:mt-2 text-xs" 
          onClick={handleCreateTask}
        >
          <Plus className="h-3 w-3 mr-1 flex-shrink-0" /> Add Task
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
