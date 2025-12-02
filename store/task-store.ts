import { apiService } from "@/api/api-client";
import { Task } from "@/types/task.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const STORAGE_KEYS = {
  TASKS: "@TaskSync:tasks",
  PENDING_ACTIONS: "@TaskSync:pendingActions",
  LAST_SYNC: "@TaskSync:lastSync",
};

interface PendingAction {
  id: string;
  type: "CREATE" | "UPDATE" | "DELETE";
  task: Partial<Task>;
  timestamp: number;
}

interface TaskStore {
  tasks: Task[];
  pendingActions: PendingAction[];
  isLoading: boolean;
  error: string | null;
  isOnline: boolean;
  lastSync: number | null;

  setTasks: (tasks: Task[]) => void;
  addTask: (taskData: Task) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskComplete: (id: string) => void;
  addPendingAction: (action: Omit<PendingAction, "id" | "timestamp">) => void;
  clearPendingActions: () => void;
  setOnlineStatus: (isOnline: boolean) => void;
  syncWithServer: () => Promise<void>;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  // Initial state
  tasks: [],
  pendingActions: [],
  isLoading: false,
  error: null,
  isOnline: true,
  lastSync: null,

  // Set tasks
  setTasks: (tasks: Task[]) => {
    set({ tasks });
    get().saveToStorage();
  },

  // Add task
  addTask: async (taskData: Task) => {
    const newTask: Task = {
      id: `temp_${Date.now()}`,
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      synced: false,
    };

    set((state) => ({
      tasks: [...state.tasks, newTask],
    }));

    // Add to pending actions
    get().addPendingAction({
      type: "CREATE",
      task: newTask,
    });

    await get().saveToStorage();

    // Try to sync if online
    if (get().isOnline) {
      get().syncWithServer();
    }
  },

  // Update task
  updateTask: async (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              ...updates,
              updatedAt: new Date().toISOString(),
              synced: false,
            }
          : task
      ),
    }));

    const updatedTask = get().tasks.find((t) => t.id === id);
    if (updatedTask) {
      get().addPendingAction({
        type: "UPDATE",
        task: updatedTask,
      });
    }

    await get().saveToStorage();

    if (get().isOnline) {
      get().syncWithServer();
    }
  },

  // Delete task
  deleteTask: async (id) => {
    const taskToDelete = get().tasks.find((task) => task.id === id);

    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));

    if (taskToDelete) {
      get().addPendingAction({
        type: "DELETE",
        task: { id: taskToDelete.id },
      });
    }

    await get().saveToStorage();

    if (get().isOnline) {
      get().syncWithServer();
    }
  },

  // Toggle complete
  toggleTaskComplete: (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (task) {
      get().updateTask(id, { completed: !task.completed });
    }
  },

  // Add pending action
  addPendingAction: (action) => {
    const pendingAction: PendingAction = {
      id: `action_${Date.now()}`,
      ...action,
      timestamp: Date.now(),
    };

    set((state) => ({
      pendingActions: [...state.pendingActions, pendingAction],
    }));
  },

  // Clear pending actions
  clearPendingActions: () => {
    set({ pendingActions: [] });
    get().saveToStorage();
  },

  // Set online status
  setOnlineStatus: (isOnline) => {
    set({ isOnline });
    if (isOnline && get().pendingActions.length > 0) {
      get().syncWithServer();
    }
  },

  // Sync with server
  syncWithServer: async () => {
    const { pendingActions, isOnline } = get();

    if (!isOnline || pendingActions.length === 0) return;

    set({ isLoading: true, error: null });

    try {
      // Process pending actions
      for (const action of pendingActions) {
        switch (action.type) {
          case "CREATE":
            await apiService.createTask(action.task as Omit<Task, "id">);
            break;
          case "UPDATE":
            if (action.task.id) {
              await apiService.updateTask(action.task.id, action.task);
            }
            break;
          case "DELETE":
            if (action.task.id) {
              await apiService.deleteTask(action.task.id);
            }
            break;
        }
      }

      // Fetch latest tasks
      const tasks = await apiService.getTasks();
      set({
        tasks: tasks.map((t) => ({ ...t, synced: true })),
        pendingActions: [],
        lastSync: Date.now(),
        isLoading: false,
      });

      await get().saveToStorage();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Sync failed",
        isLoading: false,
      });
    }
  },

  // Set loading
  setLoading: (isLoading) => set({ isLoading }),

  // Set error
  setError: (error) => set({ error }),

  // Load from storage
  loadFromStorage: async () => {
    try {
      set({ isLoading: true, error: null });

      // First, try to fetch tasks from API
      try {
        if (get().isOnline) {
          const tasks = await apiService.getTasks();
          set({
            tasks: tasks.map((t) => ({ ...t, synced: true })),
            lastSync: Date.now(),
          });
          await get().saveToStorage();
        }
      } catch (apiError) {
        console.warn(
          "Failed to fetch tasks from API, loading from storage:",
          apiError
        );
        // If API fails, fall back to local storage
      }

      // Load from local storage (as fallback or to get pending actions)
      const [tasksStr, actionsStr, syncStr] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.TASKS),
        AsyncStorage.getItem(STORAGE_KEYS.PENDING_ACTIONS),
        AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC),
      ]);

      // Only use local storage tasks if we didn't get them from API
      if (!get().tasks.length && tasksStr) {
        set({
          tasks: JSON.parse(tasksStr),
        });
      }

      // Always load pending actions and last sync from storage
      set({
        pendingActions: actionsStr ? JSON.parse(actionsStr) : [],
        lastSync: syncStr ? parseInt(syncStr, 10) : get().lastSync,
        isLoading: false,
      });

      // If we have pending actions and we're online, try to sync
      if (get().isOnline && get().pendingActions.length > 0) {
        get().syncWithServer();
      }
    } catch (error) {
      console.error("Failed to load from storage:", error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to load tasks",
      });
    }
  },

  // Save to storage
  saveToStorage: async () => {
    try {
      const { tasks, pendingActions, lastSync } = get();
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks)),
        AsyncStorage.setItem(
          STORAGE_KEYS.PENDING_ACTIONS,
          JSON.stringify(pendingActions)
        ),
        lastSync &&
          AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, lastSync.toString()),
      ]);
    } catch (error) {
      console.error("Failed to save to storage:", error);
    }
  },
}));
