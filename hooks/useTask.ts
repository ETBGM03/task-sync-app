import { useQuery } from "@tanstack/react-query";
import * as Network from "expo-network";
import { useEffect } from "react";

import { apiClient } from "@/api/api-client";
import { useTaskStore } from "@/store/task-store";
import { Task } from "@/types/task.types";

export function useTask() {
  const { tasks, isOnline, setOnlineStatus, processQueue } = useTaskStore();

  const query = useQuery({
    queryKey: ["get-tasks"],
    queryFn: async () => {
      if (!isOnline) {
        return tasks;
      }

      const response = await apiClient.get<Task[]>("/tasks");
      return response.data;
    },
    retry: 0,
  });

  useEffect(() => {
    const interval = setInterval(async () => {
      const state = await Network.getNetworkStateAsync();
      setOnlineStatus(state.isConnected ?? false);

      if (isOnline) {
        processQueue(true);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isOnline, setOnlineStatus, processQueue]);

  return { query };
}
