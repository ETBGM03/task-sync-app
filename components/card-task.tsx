import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, Layout } from "react-native-reanimated";

import { Task } from "@/types/task.types";

interface TaskItemProps {
  task: Task;
  index: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  index,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const handleDelete = () => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => onDelete(task.id),
      },
    ]);
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify()}
      layout={Layout.springify()}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => onToggle(task.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.checkboxInner, task.completed && styles.checked]}>
          {task.completed && (
            <Ionicons name="checkmark" size={18} color="#fff" />
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={[styles.title, task.completed && styles.completedText]}>
          {task.title}
        </Text>
        {task.description && (
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        )}
        <View style={styles.footer}>
          <Text style={styles.date}>
            {new Date(task.createdAt).toLocaleDateString()}
          </Text>
          {!task.synced && (
            <View style={styles.syncBadge}>
              <Ionicons name="time-outline" size={12} color="#856404" />
              <Text style={styles.syncText}>Pending</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit(task)}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={22} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDelete}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={22} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  checkbox: {
    marginRight: 12,
    justifyContent: "center",
  },
  checkboxInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: "#007AFF",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  syncBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3CD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  syncText: {
    fontSize: 11,
    color: "#856404",
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    gap: 4,
  },
  actionButton: {
    padding: 8,
  },
});
