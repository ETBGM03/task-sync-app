import { useTaskStore } from "@/store/task-store";
import { Task } from "@/types/task.types";
import { useState } from "react";
import { Alert } from "react-native";

interface UseFormTaskProps {
  text?: string;
  completed?: boolean;
  onSubmit: (data: Omit<Task, "id" | "createdAt">) => void;
}

export function useFormTask({ text, completed, onSubmit }: UseFormTaskProps) {
  const [title, setTitle] = useState(text || "");
  const [statusTask, setStatusTask] = useState(completed || false);
  const isOnline = useTaskStore((state) => state.isOnline);

  const handleSubmit = () => {
    if (title.trim() !== "") {
      onSubmit({
        title: title.trim(),
        completed: statusTask,
        isSynced: isOnline || false,
      });
    } else {
      Alert.alert("Oops!", "Por favor agrega un titulo a la tarea!");
    }
  };

  return {
    title,
    setTitle,
    statusTask,
    setStatusTask,
    handleSubmit,
  };
}
