import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  View,
} from "react-native";

import { TaskItem } from "@/components/card-task";
import EmptyState from "@/components/empty-state";
import Header from "@/components/header";
import TaskFormContent from "@/components/modal-create-task";
import { OfflineBanner } from "@/components/offline-banner";
import { RetryContent } from "@/components/RetryContent";
import SearchHome from "@/components/search-home";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useTask } from "@/hooks/useTask";
import { useTaskStore } from "@/store/task-store";
import { Task } from "@/types/task.types";
import { notificationService } from "@/utils/notifications";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

export default function HomeScreen() {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { query } = useTask();
  const {
    tasks,
    isOnline,
    setTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
  } = useTaskStore();

  const tintColor = useThemeColor({}, "tint");

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["50%", "60%"], []);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    bottomSheetModalRef.current?.present();
  };

  const handleOpenSheetModal = () => {
    bottomSheetModalRef.current?.present();
  };

  const handleCloseSheetModal = () => {
    bottomSheetModalRef.current?.dismiss();
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    handleOpenSheetModal();
  };

  const handleSubmitTask = async (data: Omit<Task, "id" | "createdAt">) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
      handleCloseSheetModal();
    } else {
      addTask(data);
      handleCloseSheetModal();
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
    [deleteTask, handleToggleTask]
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
    if (query.error) {
      return (
        <RetryContent
          message={query.error ?? undefined}
          onRetry={query.refetch}
          isLoading={query.isRefetching || query.isLoading}
        />
      );
    }

    if (query.isLoading && !tasks.length) {
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

  useEffect(() => {
    if (query.data && Array.from(query.data) && tasks.length === 0) {
      setTasks(query.data);
    }
  }, [query.data, setTasks, tasks.length]);

  return (
    <>
      <ThemedView style={styles.container}>
        <Header
          totalCount={totalCount}
          completedCount={completedCount}
          handleCreateTask={handleCreateTask}
        />

        <SearchHome searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {renderMainContent()}
      </ThemedView>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
      >
        <BottomSheetScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <TaskFormContent
            task={editingTask || ({} as Task)}
            onClose={() => bottomSheetModalRef.current?.dismiss()}
            onSubmit={(data) => handleSubmitTask(data)}
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
