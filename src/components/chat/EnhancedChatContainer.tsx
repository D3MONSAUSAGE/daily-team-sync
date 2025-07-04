
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import RoomList from './RoomList';
import EnhancedMessageArea from './EnhancedMessageArea';
import RoomMembersPanel from './RoomMembersPanel';
import UserSearchDialog from './UserSearchDialog';
import RoomSettingsDialog from './RoomSettingsDialog';
import { useRooms } from '@/hooks/useRooms';
import { usePermissions } from '@/hooks/usePermissions';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ChatRoom } from '@/types/chat';

const EnhancedChatContainer: React.FC = () => {
  const isMobile = useIsMobile();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [showMembers, setShowMembers] = useState(!isMobile);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showRoomSettings, setShowRoomSettings] = useState(false);
  
  const { rooms } = useRooms();
  const { canManageRoom } = usePermissions(selectedRoomId);

  // Get selected room details
  const { data: selectedRoom } = useQuery({
    queryKey: ['room-details', selectedRoomId],
    queryFn: async () => {
      if (!selectedRoomId) return null;
      
      const { data, error } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('id', selectedRoomId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!selectedRoomId,
  });

  const handleRoomSelect = (room: ChatRoom) => {
    setSelectedRoomId(room.id);
  };

  if (isMobile) {
    return (
      <div className="h-full flex flex-col">
        {!selectedRoomId ? (
          <RoomList
            selectedRoom={selectedRoom}
            onRoomSelect={handleRoomSelect}
          />
        ) : selectedRoom ? (
          <EnhancedMessageArea
            room={selectedRoom}
            onBack={() => setSelectedRoomId(null)}
            onToggleMembers={() => setShowMembers(!showMembers)}
            onShowSettings={() => setShowRoomSettings(true)}
            onAddMember={() => setShowAddMember(true)}
          />
        ) : null}
        
        {selectedRoom && (
          <>
            <UserSearchDialog
              open={showAddMember}
              onOpenChange={setShowAddMember}
              roomId={selectedRoomId!}
              onUsersAdded={() => {}}
            />
            
            <RoomSettingsDialog
              open={showRoomSettings}
              onOpenChange={setShowRoomSettings}
              room={selectedRoom}
            />
          </>
        )}
      </div>
    );
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      {/* Room List */}
      <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
        <RoomList
          selectedRoom={selectedRoom}
          onRoomSelect={handleRoomSelect}
        />
      </ResizablePanel>
      
      <ResizableHandle />
      
      {/* Message Area */}
      <ResizablePanel defaultSize={showMembers ? 50 : 75}>
        {selectedRoomId && selectedRoom ? (
          <EnhancedMessageArea
            room={selectedRoom}
            onToggleMembers={() => setShowMembers(!showMembers)}
            onShowSettings={() => setShowRoomSettings(true)}
            onAddMember={() => setShowAddMember(true)}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-muted/20">
            <div className="text-center">
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Select a chat room to start messaging
              </h3>
              <p className="text-sm text-muted-foreground">
                Choose a room from the sidebar or create a new one
              </p>
            </div>
          </div>
        )}
      </ResizablePanel>
      
      {/* Members Panel */}
      {showMembers && selectedRoomId && (
        <>
          <ResizableHandle />
          <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
            <div className="h-full border-l bg-card">
              <RoomMembersPanel
                roomId={selectedRoomId}
                canManage={canManageRoom}
                onAddMember={() => setShowAddMember(true)}
              />
            </div>
          </ResizablePanel>
        </>
      )}
      
      {/* Dialogs */}
      {selectedRoom && (
        <>
          <UserSearchDialog
            open={showAddMember}
            onOpenChange={setShowAddMember}
            roomId={selectedRoomId!}
            onUsersAdded={() => {}}
          />
          
          <RoomSettingsDialog
            open={showRoomSettings}
            onOpenChange={setShowRoomSettings}
            room={selectedRoom}
          />
        </>
      )}
    </ResizablePanelGroup>
  );
};

export default EnhancedChatContainer;
