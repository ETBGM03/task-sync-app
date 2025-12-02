import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { useTaskStore } from "@/store/task-store";
import { notificationService } from "@/utils/notifications";
import { useEffect } from "react";

export const unstable_settings = {
  anchor: "(tabs)",
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const loadFromStorage = useTaskStore((state) => state.loadFromStorage);

  // Initialize network monitoring
  useNetworkStatus();

  useEffect(() => {
    // Load tasks from storage on app start
    loadFromStorage();

    // Request notification permissions
    notificationService.requestPermissions();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </SafeAreaProvider>
        </QueryClientProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
