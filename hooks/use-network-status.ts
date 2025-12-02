import { useTaskStore } from "@/store/task-store";
import NetInfo from "@react-native-community/netinfo";
import { useEffect } from "react";

export const useNetworkStatus = () => {
  const setOnlineStatus = useTaskStore((state) => state.setOnlineStatus);
  const isOnline = useTaskStore((state) => state.isOnline);

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = state.isConnected && state.isInternetReachable !== false;
      setOnlineStatus(online!);

      if (online) {
        console.log("📡 Connection restored - syncing...");
      } else {
        console.log("📴 Offline mode activated");
      }
    });

    // Check initial state
    NetInfo.fetch().then((state) => {
      const online = state.isConnected && state.isInternetReachable !== false;
      setOnlineStatus(online || false);
    });

    return () => {
      unsubscribe();
    };
  }, [setOnlineStatus]);

  return { isOnline };
};
