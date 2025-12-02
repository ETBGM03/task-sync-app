import { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import CardTask from "@/components/card-task";
import EmptyState from "@/components/empty-state";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Task } from "@/types/task.types";
import { Ionicons } from "@expo/vector-icons";

// Mock data para mostrar la UI
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Completar diseño de UI",
    description:
      "Finalizar el diseño de la interfaz de usuario para el gestor de tareas",
    completed: true,
    priority: "high",
    createdAt: "Hoy, 10:30 AM",
  },
  {
    id: "2",
    title: "Revisar documentación",
    description: "Leer la documentación de React Native y Expo Router",
    completed: false,
    priority: "medium",
    createdAt: "Ayer, 3:45 PM",
  },
  {
    id: "3",
    title: "Preparar presentación",
    description: "Crear slides para la presentación del proyecto",
    completed: true,
    priority: "high",
    createdAt: "Hace 2 días",
  },
  {
    id: "4",
    title: "Hacer ejercicio",
    description: "Ir al gimnasio y hacer rutina de cardio",
    completed: false,
    priority: "low",
    createdAt: "Hace 3 días",
  },
];

export default function HomeScreen() {
  const [tasks] = useState<Task[]>(mockTasks);
  const [searchQuery, setSearchQuery] = useState("");

  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const tintColor = useThemeColor({}, "tint");

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = useCallback(({ item }: { item: Task }) => {
    return <CardTask {...item} />;
  }, []);

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <ThemedText type="title" style={styles.headerTitle}>
            Mis Tareas
          </ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            {filteredTasks.length}{" "}
            {filteredTasks.length === 1 ? "tarea" : "tareas"}
          </ThemedText>
        </View>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: tintColor }]}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: useThemeColor(
              { light: "#F2F2F7", dark: "#2C2C2E" },
              "background"
            ),
          },
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color={iconColor}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: textColor }]}
          placeholder="Buscar tareas..."
          placeholderTextColor={iconColor}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color={iconColor} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollContent}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyState isSearchableQuery={searchQuery} />}
        showsVerticalScrollIndicator={true}
      />
    </ThemedView>
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
});
