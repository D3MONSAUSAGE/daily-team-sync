
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface TaskCardDescriptionProps {
  description: string;
}

const TaskCardDescription: React.FC<TaskCardDescriptionProps> = ({ description }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Handle empty descriptions
  if (!description || description.trim() === '') {
    return (
      <div className="py-2">
        <div className="bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 p-3 rounded-lg border border-border/30 backdrop-blur-sm">
          <p className="text-sm text-muted-foreground italic flex items-center gap-2">
            <div className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
            No description provided
          </p>
        </div>
      </div>
    );
  }

  // If the description is short, don't enable expansion
  const isExpandable = description.length > 100;
  const shouldShowExpansion = isExpandable && !expanded;

  return (
    <div className="py-2">
      <div 
        className={cn(
          "relative cursor-pointer group/desc transition-all duration-300",
          isExpandable && "hover:transform hover:scale-[1.01]"
        )}
        onClick={() => isExpandable && setExpanded(!expanded)}
      >
        <div className={cn(
          "bg-gradient-to-br from-muted/20 via-muted/15 to-muted/20 p-3 rounded-lg border border-border/30",
          "hover:border-border/50 transition-all duration-300 backdrop-blur-sm",
          "hover:shadow-sm group-hover/desc:shadow-md",
          "relative overflow-hidden"
        )}>
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-background/5 to-transparent opacity-0 group-hover/desc:opacity-100 transition-opacity duration-300" />
          
          <p className={cn(
            "text-sm text-muted-foreground leading-relaxed relative z-10",
            "transition-all duration-300",
            shouldShowExpansion ? "line-clamp-2" : ""
          )}>
            {description}
          </p>
          
          {shouldShowExpansion && (
            <div className="absolute bottom-3 right-3 bg-gradient-to-l from-card via-card/95 to-transparent pl-4">
              <span className="text-xs text-primary hover:text-primary/80 font-medium tracking-wide flex items-center gap-1">
                <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                more
              </span>
            </div>
          )}
          
          {expanded && isExpandable && (
            <button className="text-xs text-primary hover:text-primary/80 mt-2 font-medium tracking-wide flex items-center gap-1 transition-colors duration-200">
              <div className="w-1 h-1 bg-primary rounded-full" />
              Show less
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCardDescription;
