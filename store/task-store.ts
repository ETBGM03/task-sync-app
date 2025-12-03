import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { Task } from "@/types/task.types";
import { notificationService } from "@/utils/notifications";

interface TaskStore {
  tasks: Task[];
  isOnline: boolean;

  addTask: (title: Omit<Task, "createdAt" | "id">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  setTasks: (tasks: Task[]) => void;
  setOnlineStatus: (isOnline: boolean) => void;
  // queue
  processQueue: (isOnline: boolean) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      isOnline: true,

      setTasks: (tasks) => set({ tasks }),
      setOnlineStatus: (isOnline) => set({ isOnline }),
      // Add local task
      addTask: (task) => {
        const newTask: Task = {
          id: `temp-${Date.now()}`,
          title: task.title!,
          completed: task.completed!,
          createdAt: new Date().toISOString(),
          isSynced: get().isOnline ? true : false,
        };

        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));
      },

      // Update local task
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }));
      },

      toggleTaskComplete: (id) => {
        const task = get().tasks.find((t) => t.id === id);
        if (task) {
          get().updateTask(id, { completed: !task.completed });
        }
      },

      // Delete local task
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      processQueue: (isOnline: boolean) => {
        const taskNotSynced = get().tasks.filter((t) => !t.isSynced);

        if (!isOnline) return;

        if (taskNotSynced.length === 0) return;

        // In real backend you would send updates to server.
        // But because your API is mock and doesn't persist...
        // We simply clear the queue.
        set((state) => ({
          tasks: state.tasks.map((task) => ({
            ...task,
            isSynced: true,
          })),
        }));
        console.log("💥 All task synchronized ");
        notificationService.notifySyncCompleted(taskNotSynced.length);
      },
    }),
    {
      name: "@TaskSync-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
