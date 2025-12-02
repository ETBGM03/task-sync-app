import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "./themed-text";

interface EmptyStateProps {
  isSearchableQuery?: string;
}

export default function EmptyState(props: EmptyStateProps) {
  const { isSearchableQuery } = props;
  const iconColor = isSearchableQuery ? "#FFA500" : "#888888";

  return (
    <View style={styles.emptyState}>
      <Ionicons name="document-text-outline" size={64} color={iconColor} />
      <ThemedText type="subtitle" style={styles.emptyTitle}>
        {isSearchableQuery ? "No se encontraron tareas" : "No hay tareas"}
      </ThemedText>
      <ThemedText style={styles.emptyDescription}>
        {isSearchableQuery
          ? "Intenta con otros términos de búsqueda"
          : "Crea tu primera tarea presionando el botón +"}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 5,
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: "center",
  },
});
