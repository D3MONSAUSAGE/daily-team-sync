
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { Task, TaskPriority } from '@/types';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const useTaskForm = (editingTask?: Task, currentProjectId?: string) => {
  const [selectedMember, setSelectedMember] = useState<string | undefined>(
    editingTask?.assignedToId
  );

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      title: editingTask?.title || '',
      description: editingTask?.description || '',
      priority: editingTask?.priority || 'Medium' as TaskPriority,
      deadline: editingTask ? format(new Date(editingTask.deadline), "yyyy-MM-dd'T'HH:mm") : '',
      projectId: editingTask?.projectId || currentProjectId || '',
    },
  });

  const { data: appUsers, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['app-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, role')
        .order('name');
        
      if (error) {
        console.error('Error loading users:', error);
        return [];
      }
      
      return data as AppUser[];
    }
  });

  return {
    register,
    handleSubmit,
    errors,
    reset,
    setValue,
    selectedMember,
    setSelectedMember,
    appUsers,
    isLoadingUsers
  };
};
