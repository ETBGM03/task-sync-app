import { ThemedText } from "@/components/themed-text";
import { useFormTask } from "@/hooks/use-form-task";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Task } from "@/types/task.types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "./ui/button";

interface TaskFormProps {
  task?: Task;
  onClose: () => void;
  onSubmit: (data: Omit<Task, "id" | "createdAt">) => void;
}

export default function TaskFormContent({
  task,
  onClose,
  onSubmit,
}: TaskFormProps) {
  const { handleSubmit, setStatusTask, setTitle, statusTask, title } =
    useFormTask({
      text: task?.title,
      completed: task?.completed,
      onSubmit,
    });
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

  const handleClose = () => {
    onClose();
  };

  const handleChangeTaskStatus = (status: boolean) => {
    setStatusTask(status);
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
        </View>

        <View style={styles.priorityContainer}>
          <Button
            style={[
              styles.priorityOption,
              {
                backgroundColor: !statusTask ? tintColor : backgroundColor,
                borderColor: !statusTask ? tintColor : borderColor,
              },
            ]}
            onPress={() => handleChangeTaskStatus(false)}
          >
            <ThemedText
              style={[
                styles.priorityLabel,
                !statusTask && styles.priorityLabelSelected,
              ]}
            >
              Pendiente
            </ThemedText>

            {!statusTask && (
              <Ionicons name="checkmark" size={18} color="#FFF" />
            )}
          </Button>

          <Button
            style={[
              styles.priorityOption,
              {
                backgroundColor: statusTask ? tintColor : backgroundColor,
                borderColor: statusTask ? tintColor : borderColor,
              },
            ]}
            onPress={() => handleChangeTaskStatus(true)}
          >
            <ThemedText
              style={[
                styles.priorityLabel,
                statusTask && styles.priorityLabelSelected,
              ]}
            >
              Completado
            </ThemedText>

            {statusTask && <Ionicons name="checkmark" size={18} color="#FFF" />}
          </Button>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            style={[
              styles.button,
              styles.submitButton,
              { backgroundColor: tintColor },
            ]}
            onPress={handleSubmit}
          >
            <ThemedText style={styles.submitButtonText}>
              {task ? "Actualizar" : "Crear"}
            </ThemedText>
          </Button>
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
    borderColor: "#DDD",
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
    marginBottom: 24,
  },
  priorityOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
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
  completed: {
    backgroundColor: "#34b8c7ff",
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
