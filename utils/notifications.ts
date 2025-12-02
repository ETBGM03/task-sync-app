// src/utils/notifications.ts
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("Failed to get push token for notifications!");
      return false;
    }

    // Configure channel for Android
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return true;
  }

  async scheduleTaskReminder(
    taskTitle: string,
    taskId: string,
    minutes: number = 60
  ) {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "⏰ Task Reminder",
          body: `Don't forget: ${taskTitle}`,
          data: { taskId },
          sound: true,
        },
        trigger: {
          seconds: minutes * 60,
        },
      });

      console.log(
        `✅ Reminder scheduled for "${taskTitle}" in ${minutes} minutes`
      );
    } catch (error) {
      console.error("Failed to schedule notification:", error);
    }
  }

  async notifyTaskCompleted(taskTitle: string) {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "✅ Task Completed!",
          body: `Great job on: ${taskTitle}`,
          sound: true,
        },
        trigger: null, // Show immediately
      });
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  }

  async notifySyncCompleted(taskCount: number) {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🔄 Sync Completed",
          body: `${taskCount} task${taskCount !== 1 ? "s" : ""} synchronized`,
          sound: false,
        },
        trigger: null,
      });
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  }

  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async cancelNotification(notificationId: string) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }
}

export const notificationService = new NotificationService();
