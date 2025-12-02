import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { Task } from "@/types/task.types";
import { getPriorityColor } from "@/utils/priority-task-color";

import { ThemedText } from "./themed-text";

export interface CardTaskProps extends Task {}

export default function CardTask(task: CardTaskProps) {
  const cardBackground = useThemeColor({}, "background");
  const iconColor = useThemeColor({}, "icon");
  const tintColor = useThemeColor({}, "tint");
  const priorityColor = getPriorityColor(task.priority, iconColor);

  return (
    <TouchableOpacity
      style={[
        styles.taskCard,
        {
          backgroundColor: cardBackground,
          borderLeftColor: priorityColor,
        },
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.taskContent}>
        <View style={styles.taskHeader}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              task.completed && styles.checkboxCompleted,
              { borderColor: task.completed ? tintColor : iconColor },
            ]}
          >
            {task.completed && (
              <Ionicons name="checkmark" size={16} color={tintColor} />
            )}
          </TouchableOpacity>
          <View style={styles.taskTitleContainer}>
            <ThemedText
              type="defaultSemiBold"
              style={[
                styles.taskTitle,
                task.completed && styles.taskTitleCompleted,
              ]}
            >
              {task.title}
            </ThemedText>
          </View>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: priorityColor + "20" },
            ]}
          >
            <View
              style={[styles.priorityDot, { backgroundColor: priorityColor }]}
            />
          </View>
        </View>
        {task.description && (
          <ThemedText
            style={[
              styles.taskDescription,
              task.completed && styles.taskDescriptionCompleted,
            ]}
            numberOfLines={2}
          >
            {task.description}
          </ThemedText>
        )}
        <View style={styles.taskFooter}>
          <Ionicons name="time-outline" size={12} color={iconColor} />
          <ThemedText style={styles.taskDate}>{task.createdAt}</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.6,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  taskCard: {
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: "transparent",
  },
  taskTitleContainer: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  taskTitleCompleted: {
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
  priorityBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  taskDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    opacity: 0.7,
  },
  taskDescriptionCompleted: {
    opacity: 0.4,
  },
  taskFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  taskDate: {
    fontSize: 12,
    opacity: 0.5,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyTitle: {
    marginTop: 24,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.6,
    paddingHorizontal: 40,
  },
});
