import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { ThemedText } from "./themed-text";

interface EmptyStateProps {
  isSearchableQuery?: string;
}

export default function EmptyState(props: EmptyStateProps) {
  const { isSearchableQuery } = props;
  const iconColor = isSearchableQuery ? "#FFA500" : "#888888";

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.container}>
      <Ionicons name="document-text-outline" size={64} color={iconColor} />
      <ThemedText type="subtitle" style={styles.title}>
        {isSearchableQuery ? "No se encontraron tareas" : "No hay tareas"}
      </ThemedText>
      <ThemedText style={styles.text}>
        {isSearchableQuery
          ? "Intenta con otros términos de búsqueda"
          : "Crea tu primera tarea presionando el botón +"}
      </ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
});
