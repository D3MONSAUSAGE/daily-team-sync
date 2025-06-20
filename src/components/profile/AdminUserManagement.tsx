
import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Copy, Edit, Trash } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const AdminUserManagement: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('user');
  const [isDeleting, setIsDeleting] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!user?.organizationId) return;

    try {
      setIsLoading(true);
      
      // With new RLS policies, we can simply select all users
      // The policies will automatically filter by organization
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .neq('id', user.id);

      if (error) throw error;
      
      // Convert database format to User type
      const formattedUsers: User[] = (data || []).map(dbUser => ({
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role as UserRole,
        organizationId: dbUser.organization_id,
        timezone: dbUser.timezone || 'UTC',
        avatar_url: dbUser.avatar_url,
        createdAt: new Date(dbUser.created_at)
      }));
      
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, [user?.organizationId, user?.id]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async () => {
    if (!user?.organizationId) return;

    try {
      setIsCreating(true);

      // Create a new user in Supabase Auth using the admin API
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUserEmail,
        password: 'defaultpassword123!', // Generate a secure default password
        user_metadata: {
          organization_id: user.organizationId,
          role: newUserRole,
          name: newUserEmail.split('@')[0] // Use email prefix as default name
        }
      });

      if (authError) throw authError;

      // The handle_new_user trigger will automatically create the user profile
      setNewUserEmail('');
      setNewUserRole('user');
      await fetchUsers(); // Refresh the list
      toast.success('User created successfully');
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteUser = async (userToDelete: User) => {
    if (!user?.organizationId) return;

    try {
      setIsDeleting(true);

      // Delete user from Supabase Auth (this will cascade to users table)
      const { error: authError } = await supabase.auth.admin.deleteUser(userToDelete.id);
      if (authError) throw authError;

      setUserToDelete(null);
      await fetchUsers(); // Refresh the list
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenDeleteDialog = (user: User) => {
    setUserToDelete(user);
  };

  const handleCloseDeleteDialog = () => {
    setUserToDelete(null);
  };

  // Only show this component to admins and superadmins
  if (!user || !['admin', 'superadmin'].includes(user.role)) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      {/* Create User Section - Only for superadmins */}
      {user.role === 'superadmin' && (
        <div className="mb-6 p-4 border rounded-md">
          <h3 className="text-lg font-semibold mb-2">Create New User</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Email address"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                className="w-full p-2 border rounded-md"
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value as UserRole)}
              >
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleCreateUser} 
                disabled={isCreating || !newUserEmail}
                className="w-full"
              >
                {isCreating ? 'Creating...' : 'Create User'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* User List Table */}
      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <Table>
          <TableCaption>Users in your organization.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
                        <Copy className="mr-2 h-4 w-4" /> Copy ID
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleOpenDeleteDialog(user)} 
                        className="text-red-500"
                        disabled={user.role === 'superadmin'} // Prevent deleting superadmins
                      >
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Delete User Confirmation Dialog */}
      <AlertDialog open={userToDelete !== null} onOpenChange={handleCloseDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user "{userToDelete?.name}" from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteDialog}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (userToDelete) {
                handleDeleteUser(userToDelete);
                handleCloseDeleteDialog();
              }
            }} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminUserManagement;
