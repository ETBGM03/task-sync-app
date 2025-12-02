import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Task, TaskPriority } from "@/types/task.types";
import { getPriorityColor } from "@/utils/priority-task-color";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface TaskFormProps {
  task?: Task;
  onClose: () => void;
  onSubmit: (data: Partial<Task>) => void;
}

const PRIORITY_OPTIONS: { value: TaskPriority; label: string; icon: string }[] =
  [
    { value: "low", label: "Baja", icon: "arrow-down-circle-outline" },
    { value: "medium", label: "Media", icon: "remove-circle-outline" },
    { value: "high", label: "Alta", icon: "arrow-up-circle-outline" },
  ];

export default function TaskFormContent({
  task,
  onClose,
  onSubmit,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [errors, setErrors] = useState<{ title?: string }>({});

  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const tintColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor(
    { light: "#F2F2F7", dark: "#2C2C2E" },
    "background"
  );
  const inputBackground = useThemeColor(
    { light: "#FFFFFF", dark: "#1C1C1E" },
    "background"
  );
  const borderColor = useThemeColor(
    { light: "#E5E5EA", dark: "#38383A" },
    "background"
  );

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setPriority(task.priority || "medium");
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
    }
    setErrors({});
  }, [task]);

  const validate = (): boolean => {
    const newErrors: { title?: string } = {};

    if (!title.trim()) {
      newErrors.title = "El título es requerido";
    } else if (title.length < 3) {
      newErrors.title = "El título debe tener al menos 3 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setErrors({});
    onClose();
  };

  return (
    <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <ThemedText type="subtitle" style={styles.headerTitle}>
          {task ? "Editar Tarea" : "Nueva Tarea"}
        </ThemedText>
        <TouchableOpacity
          onPress={handleClose}
          style={styles.closeButton}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={24} color={iconColor} />
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.form}>
        {/* Title Input */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>
            Título <ThemedText style={styles.required}>*</ThemedText>
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                color: textColor,
                backgroundColor: inputBackground,
                borderColor: errors.title ? "#FF3B30" : borderColor,
              },
            ]}
            value={title}
            onChangeText={(text) => {
              setTitle(text);
            }}
            placeholder="Ingresa el título de la tarea"
            placeholderTextColor={iconColor}
            maxLength={100}
            autoFocus={!task}
          />
          {errors.title && (
            <ThemedText style={styles.errorText}>{errors.title}</ThemedText>
          )}
        </View>

        {/* Description Input */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Descripción</ThemedText>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              {
                color: textColor,
                backgroundColor: inputBackground,
                borderColor,
              },
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder="Ingresa una descripción (opcional)"
            placeholderTextColor={iconColor}
            multiline
            numberOfLines={4}
            maxLength={500}
            textAlignVertical="top"
          />
          <ThemedText style={styles.charCount}>
            {description.length}/500
          </ThemedText>
        </View>

        {/* Priority Selector */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Prioridad</ThemedText>
          <View style={styles.priorityContainer}>
            {PRIORITY_OPTIONS.map((option) => {
              const isSelected = priority === option.value;
              const priorityColor = getPriorityColor(option.value, tintColor);
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.priorityOption,
                    {
                      backgroundColor: isSelected
                        ? priorityColor
                        : backgroundColor,
                      borderColor: isSelected ? priorityColor : borderColor,
                    },
                  ]}
                  onPress={() => setPriority(option.value)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={20}
                    color={isSelected ? "#FFFFFF" : iconColor}
                  />
                  <ThemedText
                    style={[
                      styles.priorityLabel,
                      isSelected && styles.priorityLabelSelected,
                    ]}
                  >
                    {option.label}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.cancelButton,
              { backgroundColor: backgroundColor, borderColor },
            ]}
            onPress={handleClose}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.submitButton,
              { backgroundColor: tintColor },
            ]}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.submitButtonText}>
              {task ? "Actualizar" : "Crear"}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontWeight: "700",
  },
  closeButton: {
    padding: 4,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    opacity: 0.8,
  },
  required: {
    color: "#FF3B30",
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 48,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 16,
    paddingBottom: 16,
  },
  charCount: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.5,
    textAlign: "right",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 6,
  },
  priorityContainer: {
    flexDirection: "row",
    gap: 12,
  },
  priorityOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  priorityLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  priorityLabelSelected: {
    color: "#FFFFFF",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    opacity: 0.8,
  },
  submitButton: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
