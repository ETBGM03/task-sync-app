import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { ThemedText } from "./themed-text";
import { Button } from "./ui/button";

interface HeaderProps {
  completedCount: number;
  totalCount: number;
  handleCreateTask?: () => void;
}

export default function Header(props: HeaderProps) {
  const { completedCount, totalCount, handleCreateTask } = props;

  const tintColor = useThemeColor({}, "tint");

  return (
    <View style={styles.header}>
      <View>
        <ThemedText
          testID="header-title"
          type="title"
          style={styles.headerTitle}
        >
          Mis Tareas
        </ThemedText>
        <ThemedText testID="header-helper-count" style={styles.headerSubtitle}>
          {completedCount} de {totalCount} completadas
        </ThemedText>
      </View>
      <Button
        style={[styles.addButton, { backgroundColor: tintColor }]}
        onPress={() => handleCreateTask?.()}
        testID="header-add-task"
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
