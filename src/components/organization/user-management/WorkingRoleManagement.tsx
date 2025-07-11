
import React, { useState } from 'react';
import { UserRole } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import RoleDisplay from './RoleDisplay';
import RoleSelector from './RoleSelector';
import RoleChangeConfirmationDialog from './RoleChangeConfirmationDialog';

interface WorkingRoleManagementProps {
  targetUser: {
    id: string;
    name?: string;
    email: string;
    role: string;
  };
  onRoleChanged: () => void;
}

// Define proper types for the database response
interface RoleChangeValidation {
  allowed: boolean;
  requires_transfer?: boolean;
  current_superadmin_name?: string;
  reason?: string;
}

const WorkingRoleManagement: React.FC<WorkingRoleManagementProps> = ({ 
  targetUser, 
  onRoleChanged 
}) => {
  const { user: currentUser } = useAuth();
  const [isChangingRole, setIsChangingRole] = useState(false);
  const [newRole, setNewRole] = useState<UserRole | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [requiresTransfer, setRequiresTransfer] = useState(false);
  const [currentSuperadminName, setCurrentSuperadminName] = useState<string>('');

  const currentTargetRole = targetUser.role as UserRole;
  const userName = targetUser.name || targetUser.email.split('@')[0];

  // Enhanced role management permissions - Fixed logic
  const canManageThisUser = currentUser && (() => {
    console.log('Checking permissions:', {
      currentUserRole: currentUser.role,
      targetUserRole: currentTargetRole,
      targetUserId: targetUser.id,
      currentUserId: currentUser.id
    });

    // Users cannot manage themselves
    if (targetUser.id === currentUser.id) {
      console.log('Cannot manage self');
      return false;
    }
    
    // Superadmin can manage everyone except themselves
    if (currentUser.role === 'superadmin') {
      console.log('Superadmin can manage this user');
      return true;
    }
    
    // Admin can manage managers and users (but not superadmins or other admins)
    if (currentUser.role === 'admin' && ['manager', 'user'].includes(currentTargetRole)) {
      console.log('Admin can manage this user');
      return true;
    }
    
    console.log('No permission to manage this user');
    return false;
  })();

  const getAvailableRoles = (): UserRole[] => {
    if (!currentUser || !canManageThisUser) {
      console.log('No available roles - no permission');
      return [];
    }
    
    const roles: UserRole[] = [];
    
    if (currentUser.role === 'superadmin') {
      // Superadmin can assign any role
      roles.push('user', 'manager', 'admin', 'superadmin');
      console.log('Superadmin available roles:', roles);
    } else if (currentUser.role === 'admin') {
      // Admin can only assign user and manager roles
      roles.push('user', 'manager');
      console.log('Admin available roles:', roles);
    }
    
    // Filter out current role
    const filteredRoles = roles.filter(role => role !== currentTargetRole);
    console.log('Final available roles:', filteredRoles);
    return filteredRoles;
  };

  const handleRoleSelect = async (role: UserRole) => {
    console.log('Role selected:', role);
    setNewRole(role);
    
    // Check if this requires superadmin transfer
    if (role === 'superadmin' && currentTargetRole !== 'superadmin') {
      try {
        console.log('Checking if superadmin transfer is required');
        const { data, error } = await supabase.rpc('can_change_user_role', {
          manager_user_id: currentUser?.id,
          target_user_id: targetUser.id,
          new_role: role
        });

        if (error) {
          console.error('Error checking role change requirements:', error);
          throw error;
        }

        console.log('Role change validation result:', data);
        const validation = data as unknown as RoleChangeValidation;

        if (validation?.requires_transfer) {
          setRequiresTransfer(true);
          setCurrentSuperadminName(validation.current_superadmin_name || 'Current Superadmin');
          console.log('Transfer required, current superadmin:', validation.current_superadmin_name);
        }
      } catch (error) {
        console.error('Error checking role change requirements:', error);
        toast.error('Failed to validate role change');
        return;
      }
    }
    
    setConfirmDialogOpen(true);
  };

  const handleRoleChange = async () => {
    if (!newRole || !currentUser || !canManageThisUser) {
      console.log('Cannot proceed with role change:', { newRole, currentUser: !!currentUser, canManage: canManageThisUser });
      return;
    }

    setIsChangingRole(true);
    try {
      console.log('Starting role change process:', {
        targetUserId: targetUser.id,
        newRole: newRole,
        requiresTransfer
      });

      const { data, error } = await supabase.functions.invoke('update-user-role', {
        body: {
          targetUserId: targetUser.id,
          newRole: newRole
        }
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        console.error('Edge function error:', error);
        
        let userMessage = 'Failed to update role';
        if (error.message?.includes('Failed to fetch')) {
          userMessage = 'Connection error. Please check your internet connection and try again.';
        } else if (error.message?.includes('Unauthorized')) {
          userMessage = 'You do not have permission to change this user\'s role.';
        } else if (error.message?.includes('not found')) {
          userMessage = 'User not found. They may have been deleted.';
        } else if (error.message) {
          userMessage = error.message;
        }
        
        throw new Error(userMessage);
      }

      if (data?.error) {
        console.error('Edge function returned error:', data.error);
        throw new Error(data.error);
      }

      if (!data?.success) {
        console.error('Edge function did not return success');
        throw new Error('Role update failed - please try again');
      }

      console.log('Role update successful:', data);
      
      let successMessage = `Role updated to ${newRole} successfully`;
      if (requiresTransfer) {
        successMessage = `${userName} promoted to superadmin. ${currentSuperadminName} has been demoted to admin.`;
      }
      
      toast.success(successMessage);
      onRoleChanged();
      handleDialogClose();
    } catch (error) {
      console.error('Error updating role:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update role';
      toast.error(errorMessage);
    } finally {
      setIsChangingRole(false);
    }
  };

  const handleDialogClose = () => {
    setConfirmDialogOpen(false);
    setNewRole(null);
    setRequiresTransfer(false);
    setCurrentSuperadminName('');
  };

  const availableRoles = getAvailableRoles();

  return (
    <>
      <div className="flex items-center gap-2">
        <RoleDisplay role={currentTargetRole} />
        <RoleSelector
          availableRoles={availableRoles}
          isChangingRole={isChangingRole}
          onRoleSelect={handleRoleSelect}
        />
      </div>

      <RoleChangeConfirmationDialog
        isOpen={confirmDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleRoleChange}
        isChangingRole={isChangingRole}
        userName={userName}
        currentRole={currentTargetRole}
        newRole={newRole}
        requiresTransfer={requiresTransfer}
        currentSuperadminName={currentSuperadminName}
      />
    </>
  );
};

export default WorkingRoleManagement;
