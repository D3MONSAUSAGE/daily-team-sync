
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project, Task } from '@/types';
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Calendar, Users, Plus, ListTodo } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from 'lucide-react';
import { useTask } from '@/contexts/task';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onViewTasks?: (project: Project) => void;
  onCreateTask?: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onEdit, 
  onViewTasks, 
  onCreateTask 
}) => {
  const { deleteProject, updateProject } = useTask();
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  
  useEffect(() => {
    const fetchProjectTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('project_id', project.id);
          
        if (error) {
          console.error('Error fetching project tasks:', error);
          return;
        }
        
        if (data) {
          const mappedTasks: Task[] = data.map(task => ({
            id: task.id,
            userId: task.user_id || '',
            projectId: task.project_id || undefined,
            title: task.title || '',
            description: task.description || '',
            deadline: new Date(task.deadline || new Date()),
            priority: task.priority as Task['priority'] || 'Medium',
            status: task.status as Task['status'] || 'To Do',
            createdAt: new Date(task.created_at || new Date()),
            updatedAt: new Date(task.updated_at || new Date()),
            completedAt: task.completed_at ? new Date(task.completed_at) : undefined,
            assignedToId: task.assigned_to_id || undefined,
            tags: [],
            comments: []
          }));
          setProjectTasks(mappedTasks);
        }
      } catch (error) {
        console.error('Error fetching project tasks:', error);
      }
    };
    
    fetchProjectTasks();
  }, [project.id]);
  
  const calculateProgress = (tasks: Task[]) => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(task => task.status === 'Completed').length;
    return Math.round((completed / tasks.length) * 100);
  };
  
  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter(task => task.status === 'Completed').length;
  const progress = calculateProgress(projectTasks);
  
  const handleToggleCompletion = () => {
    updateProject(project.id, { is_completed: !project.is_completed });
  };
  
  return (
    <Card className={`card-hover relative overflow-hidden ${project.is_completed ? 'bg-gray-50' : ''}`}>
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
            <DropdownMenuItem onClick={() => onViewTasks && onViewTasks(project)}>
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
        <p className="text-xs md:text-sm text-gray-600 line-clamp-2 min-h-[2rem]">{project.description}</p>
        
        <div className="flex flex-wrap items-center justify-between pt-1 md:pt-2 gap-y-1">
          <div className="flex items-center text-xs text-gray-500 gap-1">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">
              {format(new Date(project.startDate), 'MMM d')} - {format(new Date(project.endDate), 'MMM d')}
            </span>
          </div>
          
          <div className="flex items-center text-xs text-gray-500 gap-1">
            <Users className="h-3 w-3 flex-shrink-0" />
            <span>{projectTasks.filter(task => task.assignedToId).length} assigned</span>
          </div>
        </div>
        
        <div className="pt-1 md:pt-3 space-y-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-xs font-medium">
              <ListTodo className="h-3 w-3 mr-1 text-blue-500 flex-shrink-0" />
              <span>{totalTasks} {totalTasks === 1 ? 'Task' : 'Tasks'}</span>
            </div>
            <Badge variant="outline" className="ml-1 text-xs">{progress}%</Badge>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>{completedTasks} of {totalTasks} completed</span>
          </div>
          <Progress value={progress} className="h-1.5 md:h-2" />
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-1 md:mt-2 text-xs" 
          onClick={() => onCreateTask && onCreateTask(project)}
        >
          <Plus className="h-3 w-3 mr-1 flex-shrink-0" /> Add Task
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
