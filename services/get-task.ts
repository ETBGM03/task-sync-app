import { apiClient } from "@/api/api-client";
import { Task } from "@/types/task.types";

export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await apiClient.get<Task[]>(`/tasks`);
    return response.data;
  } catch {
    throw new Error("Failed to fetch movie details");
  }
};
