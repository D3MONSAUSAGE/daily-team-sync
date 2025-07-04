
-- Phase 2 - Step 2: Tasks Table RLS Policy Cleanup
-- Drop all existing conflicting policies on the tasks table

-- Drop all existing policies on tasks table
DROP POLICY IF EXISTS "Users can view tasks in their organization" ON public.tasks;
DROP POLICY IF EXISTS "Users can insert tasks in their organization" ON public.tasks;
DROP POLICY IF EXISTS "Users can update tasks in their organization" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete tasks in their organization" ON public.tasks;
DROP POLICY IF EXISTS "Org isolation for tasks" ON public.tasks;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.tasks;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.tasks;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.tasks;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON public.tasks;
DROP POLICY IF EXISTS "Users can view own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can create tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Allow authenticated users to view tasks" ON public.tasks;
DROP POLICY IF EXISTS "Allow authenticated users to insert tasks" ON public.tasks;
DROP POLICY IF EXISTS "Allow authenticated users to update tasks" ON public.tasks;
DROP POLICY IF EXISTS "Allow authenticated users to delete tasks" ON public.tasks;
DROP POLICY IF EXISTS "Tasks are viewable by organization members" ON public.tasks;
DROP POLICY IF EXISTS "Tasks can be created by organization members" ON public.tasks;
DROP POLICY IF EXISTS "Tasks can be updated by organization members" ON public.tasks;
DROP POLICY IF EXISTS "Tasks can be deleted by organization members" ON public.tasks;
DROP POLICY IF EXISTS "Organization members can view tasks" ON public.tasks;
DROP POLICY IF EXISTS "Organization members can create tasks" ON public.tasks;
DROP POLICY IF EXISTS "Organization members can update tasks" ON public.tasks;
DROP POLICY IF EXISTS "Organization members can delete tasks" ON public.tasks;
DROP POLICY IF EXISTS "Allow organization access to tasks" ON public.tasks;
DROP POLICY IF EXISTS "Task assignees can view tasks" ON public.tasks;
DROP POLICY IF EXISTS "Task creators can manage tasks" ON public.tasks;
DROP POLICY IF EXISTS "Assigned users can update tasks" ON public.tasks;
DROP POLICY IF EXISTS "Admins can manage all tasks" ON public.tasks;
DROP POLICY IF EXISTS "Super admins can manage all tasks" ON public.tasks;

-- Create 4 clean, secure policies for the tasks table
-- Policy 1: SELECT - Users can view tasks from their organization
CREATE POLICY "tasks_select_organization" 
ON public.tasks 
FOR SELECT 
TO authenticated
USING (organization_id = public.get_current_user_organization_id());

-- Policy 2: INSERT - Users can create tasks in their organization
CREATE POLICY "tasks_insert_organization" 
ON public.tasks 
FOR INSERT 
TO authenticated
WITH CHECK (organization_id = public.get_current_user_organization_id());

-- Policy 3: UPDATE - Task creators, assignees, and admins can update tasks in their organization
CREATE POLICY "tasks_update_creators_assignees_admins" 
ON public.tasks 
FOR UPDATE 
TO authenticated
USING (
  organization_id = public.get_current_user_organization_id()
  AND (
    user_id = auth.uid()::text
    OR assigned_to_id = auth.uid()::text
    OR auth.uid()::text = ANY(assigned_to_ids)
    OR (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'superadmin')
  )
);

-- Policy 4: DELETE - Task creators and admins can delete tasks in their organization
CREATE POLICY "tasks_delete_creators_admins" 
ON public.tasks 
FOR DELETE 
TO authenticated
USING (
  organization_id = public.get_current_user_organization_id()
  AND (
    user_id = auth.uid()::text
    OR (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'superadmin')
  )
);
