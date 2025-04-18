
import React from 'react';
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Task, TaskStatus } from '@/types';

interface TaskCardActionsProps {
  onEdit?: (task: Task) => void;
  onAssign?: (task: Task) => void;
  onStatusChange: (status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onShowComments: () => void;
  task: Task;
}

const TaskCardActions: React.FC<TaskCardActionsProps> = ({
  onEdit,
  onAssign,
  onStatusChange,
  onDelete,
  onShowComments,
  task,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="text-xs md:text-sm">
        <DropdownMenuItem onClick={() => onEdit && onEdit(task)}>
          Edit
        </DropdownMenuItem>
        {onAssign && (
          <DropdownMenuItem onClick={() => onAssign(task)}>
            Assign Member
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => onStatusChange('To Do')}>
          Mark as To Do
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange('In Progress')}>
          Mark as In Progress
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange('Pending')}>
          Mark as Pending
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange('Completed')}>
          Mark as Completed
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onShowComments}>
          View Comments
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-red-500" 
          onClick={() => onDelete(task.id)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskCardActions;
