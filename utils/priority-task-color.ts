import { TaskPriority } from "@/types/task.types";

export const getPriorityColor = (
  priority: TaskPriority,
  defaultColor: string
) => {
  switch (priority) {
    case "high":
      return "#FF3B30";
    case "medium":
      return "#FF9500";
    case "low":
      return "#34C759";
    default:
      return defaultColor;
  }
};
