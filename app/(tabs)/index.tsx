import { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { TaskItem } from "@/components/card-task";
import EmptyState from "@/components/empty-state";
import TaskFormContent from "@/components/modal-create-task";
import { OfflineBanner } from "@/components/offline-banner";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useTaskStore } from "@/store/task-store";
import { Task } from "@/types/task.types";
import { notificationService } from "@/utils/notifications";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

export default function HomeScreen() {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const {
    tasks,
    isLoading,
    isOnline,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
  } = useTaskStore();

  const [searchQuery, setSearchQuery] = useState("");

  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const tintColor = useThemeColor({}, "tint");

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const snapPoints = useMemo(() => ["50%", "75%"], []);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    bottomSheetModalRef.current?.present();
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    bottomSheetModalRef.current?.present();
  };

  const handleSubmitTask = async (data: Partial<Task>) => {
    if (editingTask) {
      // Update existing task
      await updateTask(editingTask.id, data);
    } else {
      // Create new task
      await addTask(data as Task);
      // Schedule reminder notification
      notificationService.scheduleTaskReminder(data.title!, "new-task", 60);
    }
  };

  const handleToggleTask = useCallback(
    async (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (task && !task.completed) {
        // Notify on completion
        await notificationService.notifyTaskCompleted(task.title);
      }
      toggleTaskComplete(id);
    },
    [tasks, toggleTaskComplete]
  );

  const filteredTasks = useMemo(() => {
    if (!searchQuery) return tasks;
    const lowerQuery = searchQuery.toLowerCase();
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery, tasks]);

  const completedCount = filteredTasks.filter((task) => task.completed).length;
  const totalCount = filteredTasks.length;

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<Task>) => {
      return (
        <TaskItem
          task={item}
          onDelete={deleteTask}
          onEdit={handleEditTask}
          onToggle={handleToggleTask}
          index={index}
        />
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  const renderMainContent = () => {
    if (isLoading && !tasks.length) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tintColor} />
          <ThemedText style={styles.loadingText}>Cargando...</ThemedText>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollContent}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyState isSearchableQuery={searchQuery} />}
        showsVerticalScrollIndicator={true}
      />
    );
  };

  return (
    <>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <ThemedText type="title" style={styles.headerTitle}>
              Mis Tareas
            </ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              {completedCount} de {totalCount} completadas
            </ThemedText>
          </View>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: tintColor }]}
            activeOpacity={0.8}
            onPress={handleCreateTask}
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

        {renderMainContent()}
      </ThemedView>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
      >
        <BottomSheetScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <TaskFormContent
            task={editingTask as Task}
            onClose={() => bottomSheetModalRef.current?.dismiss()}
            onSubmit={handleSubmitTask}
          />
        </BottomSheetScrollView>
      </BottomSheetModal>

      {!isOnline && <OfflineBanner />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffd",
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
  closeButton: {
    fontSize: 24,
    color: "#666",
    fontWeight: "300",
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#F9F9F9",
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F0F0F0",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#007AFF",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
});
