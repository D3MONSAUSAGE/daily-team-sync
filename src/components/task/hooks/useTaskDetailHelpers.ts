
import { Task } from "@/types";
import { format as formatDateFns } from "date-fns";

export const useTaskDetailHelpers = (task: Task) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "To Do":
        return "bg-slate-200 text-slate-700";
      case "In Progress":
        return "bg-blue-200 text-blue-800";
      case "Pending":
        return "bg-amber-200 text-amber-700";
      case "Completed":
        return "bg-green-200 text-green-700";
      default:
        return "";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Low":
        return "bg-blue-100 text-blue-800";
      case "Medium":
        return "bg-amber-100 text-amber-800";
      case "High":
        return "bg-rose-100 text-rose-800";
      default:
        return "";
    }
  };

  const isOverdue = () => {
    try {
      const now = new Date();
      const deadline = new Date(task.deadline);
      return task.status !== "Completed" && deadline < now;
    } catch (error) {
      return false;
    }
  };

  const formatDate = (date: Date | string) => {
    try {
      const formattedDate = new Date(date);
      return formatDateFns(formattedDate, "MMM d, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  const formatTime = (date: Date | string) => {
    try {
      const formattedDate = new Date(date);
      return formatDateFns(formattedDate, "h:mm a");
    } catch {
      return "Invalid time";
    }
  };

  // Handle assigned to name
  const getAssignedToName = () => {
    if (!task.assignedToName || task.assignedToName.trim() === "") {
      return "Unassigned";
    }
    if (task.assignedToId && (!task.assignedToName || task.assignedToName === task.assignedToId)) {
      return "Unassigned";
    }
    return task.assignedToName;
  };

  return {
    getStatusColor,
    getPriorityColor,
    isOverdue,
    formatDate,
    formatTime,
    getAssignedToName
  };
};
