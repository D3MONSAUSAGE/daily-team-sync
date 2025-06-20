
import React, { useState } from 'react';
import { User } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EnhancedUserDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userToDelete: User | null;
  onUserDeleted: () => void;
}

const EnhancedUserDeleteDialog: React.FC<EnhancedUserDeleteDialogProps> = ({
  open,
  onOpenChange,
  userToDelete,
  onUserDeleted
}) => {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteUser = async () => {
    if (!user?.organizationId || !userToDelete) return;

    try {
      setIsDeleting(true);

      // Delete user from Supabase Auth
      const { error: authError } = await supabase.auth.admin.deleteUser(userToDelete.id);
      if (authError) throw authError;

      // Delete user from the users table
      const { error: profileError } = await supabase
        .from('users')
        .delete()
        .eq('id', userToDelete.id);

      if (profileError) throw profileError;

      toast.success('User deleted successfully');
      onUserDeleted();
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user
            "{userToDelete?.name || userToDelete?.email}" from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDeleteUser} 
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EnhancedUserDeleteDialog;
