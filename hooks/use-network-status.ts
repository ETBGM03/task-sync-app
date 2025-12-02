import { useTaskStore } from "@/store/task-store";
import { useNetworkState } from "expo-network";
import { useEffect } from "react";

export const useNetworkStatus = () => {
  const setOnlineStatus = useTaskStore((state) => state.setOnlineStatus);
  const isOnline = useTaskStore((state) => state.isOnline);
  const networkState = useNetworkState();

  useEffect(() => {
    if (networkState.isConnected !== null) {
      setOnlineStatus(networkState.isConnected as boolean);
    }
  }, [isOnline, networkState, setOnlineStatus]);

  return { isOnline };
};
