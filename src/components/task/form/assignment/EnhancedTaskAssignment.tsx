
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, User as UserIcon } from 'lucide-react';
import { User } from '@/types';
import AssignmentToggle from './AssignmentToggle';
import TaskAssigneeSelect from '../TaskAssigneeSelect';
import TeamAssignmentCard from '../../TeamAssignmentCard';
import AssignmentSummary from './AssignmentSummary';

interface EnhancedTaskAssignmentProps {
  selectedMember?: string;
  selectedMembers: string[];
  onAssign: (userId: string) => void;
  onMembersChange: (memberIds: string[]) => void;
  users: User[];
  isLoading: boolean;
  editingTask?: any;
}

const EnhancedTaskAssignment: React.FC<EnhancedTaskAssignmentProps> = ({
  selectedMember,
  selectedMembers,
  onAssign,
  onMembersChange,
  users,
  isLoading,
  editingTask
}) => {
  // Determine initial mode based on existing assignment
  const [multiAssignMode, setMultiAssignMode] = useState(
    editingTask?.assignedToIds?.length > 1 || selectedMembers.length > 1
  );

  const handleToggle = (enabled: boolean) => {
    setMultiAssignMode(enabled);
    
    if (enabled) {
      // Switch to multi-assign: keep current selection if single user is selected
      if (selectedMember && selectedMember !== "unassigned") {
        onMembersChange([selectedMember]);
      }
      onAssign("unassigned"); // Clear single assignment
    } else {
      // Switch to single assign: take first user from multi-assignment
      if (selectedMembers.length > 0) {
        onAssign(selectedMembers[0]);
      }
      onMembersChange([]); // Clear multi assignment
    }
  };

  const selectedUsers = users.filter(user => selectedMembers.includes(user.id));

  const handleUsersChange = (newUsers: User[]) => {
    onMembersChange(newUsers.map(u => u.id));
  };

  return (
    <Card className="border-2 border-blue-100 h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          {multiAssignMode ? <Users className="h-5 w-5" /> : <UserIcon className="h-5 w-5" />}
          Task Assignment
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <AssignmentToggle
          multiAssignMode={multiAssignMode}
          onToggle={handleToggle}
        />

        {multiAssignMode ? (
          <div className="space-y-4">
            <TeamAssignmentCard
              selectedUsers={selectedUsers}
              setSelectedUsers={handleUsersChange}
              users={users}
              loadingUsers={isLoading}
            />
            <AssignmentSummary selectedMembersCount={selectedMembers.length} />
          </div>
        ) : (
          <TaskAssigneeSelect
            selectedMember={selectedMember || "unassigned"}
            onAssign={onAssign}
            users={users}
            isLoading={isLoading}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedTaskAssignment;
