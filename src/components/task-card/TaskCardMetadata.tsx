
import React from 'react';
import { Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface TaskCardMetadataProps {
  deadline: Date;
  assignedToName?: string;
  isOverdue: boolean;
}

const TaskCardMetadata: React.FC<TaskCardMetadataProps> = ({
  deadline,
  assignedToName,
  isOverdue,
}) => {
  // Format the display name - if empty or undefined, show "Unassigned"
  const displayName = assignedToName && assignedToName.trim() !== '' 
    ? assignedToName 
    : 'Unassigned';

  // Check if deadline is today
  const isToday = new Date().toDateString() === new Date(deadline).toDateString();
  
  // Check if deadline is tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = tomorrow.toDateString() === new Date(deadline).toDateString();
  
  // Set deadline class based on urgency
  const deadlineClass = isOverdue ? "text-red-500 font-medium" :
                       isToday ? "text-orange-500 font-medium" : 
                       isTomorrow ? "text-amber-500" : 
                       "text-gray-500";

  return (
    <div className="flex items-center justify-between pt-1 md:pt-2">
      <motion.div 
        className={`flex items-center text-xs gap-1 ${deadlineClass}`}
        whileHover={{ scale: 1.05 }}
      >
        <Clock className="h-3 w-3 flex-shrink-0" />
        <span className="truncate">
          {isToday ? "Today" : isTomorrow ? "Tomorrow" : format(deadline, 'MMM d')} 
          {" at "} 
          {format(deadline, 'h:mm a')}
        </span>
      </motion.div>
      
      <motion.div 
        className="flex items-center text-xs text-gray-500 gap-1"
        whileHover={{ scale: 1.05 }}
      >
        <User className="h-3 w-3 flex-shrink-0" />
        <span 
          className={`truncate max-w-[100px] ${assignedToName ? "" : "italic text-gray-400"}`}
        >
          {displayName}
        </span>
      </motion.div>
    </div>
  );
};

export default TaskCardMetadata;
