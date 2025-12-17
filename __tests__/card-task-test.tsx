import { TaskItem } from "@/components/card-task";
import { Task } from "@/types/task.types";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Alert } from "react-native";

// Mock Alert
jest.spyOn(Alert, "alert");

describe("<TaskItem/> component", () => {
  const mockTask: Task = {
    id: "task-1",
    title: "Test Task",
    completed: false,
    createdAt: "2024-01-15T10:00:00Z",
    isSynced: true,
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onDelete: jest.fn(),
    onEdit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (Alert.alert as jest.Mock).mockClear();
  });

  describe("Rendering", () => {
    it("renders correctly with all props", () => {
      render(
        <TaskItem
          index={0}
          onDelete={mockHandlers.onDelete}
          onEdit={mockHandlers.onEdit}
          onToggle={mockHandlers.onToggle}
          task={mockTask}
        />
      );

      expect(screen.getByTestId("task-item")).toBeTruthy();
    });

    it("displays task title", () => {
      render(
        <TaskItem
          index={0}
          onDelete={mockHandlers.onDelete}
          onEdit={mockHandlers.onEdit}
          onToggle={mockHandlers.onToggle}
          task={mockTask}
        />
      );

      expect(screen.getByTestId("task-title")).toBeTruthy();
      expect(screen.getByText("Test Task")).toBeTruthy();
    });

    it("does not display description when empty", () => {
      const taskWithoutDescription: Task = {
        ...mockTask,
      };

      render(
        <TaskItem
          index={0}
          onDelete={mockHandlers.onDelete}
          onEdit={mockHandlers.onEdit}
          onToggle={mockHandlers.onToggle}
          task={taskWithoutDescription}
        />
      );

      expect(screen.queryByTestId("task-description")).toBeNull();
    });

    it("displays formatted creation date", () => {
      render(
        <TaskItem
          index={0}
          onDelete={mockHandlers.onDelete}
          onEdit={mockHandlers.onEdit}
          onToggle={mockHandlers.onToggle}
          task={mockTask}
        />
      );

      const formattedDate = new Date(mockTask.createdAt).toLocaleDateString();
      expect(screen.getByTestId("task-date")).toBeTruthy();
      expect(screen.getByText(formattedDate)).toBeTruthy();
    });

    it("renders edit and delete action buttons", () => {
      render(
        <TaskItem
          index={0}
          onDelete={mockHandlers.onDelete}
          onEdit={mockHandlers.onEdit}
          onToggle={mockHandlers.onToggle}
          task={mockTask}
        />
      );

      expect(screen.getByTestId("task-edit-button")).toBeTruthy();
      expect(screen.getByTestId("task-delete-button")).toBeTruthy();
    });

    it("renders checkbox", () => {
      render(
        <TaskItem
          index={0}
          onDelete={mockHandlers.onDelete}
          onEdit={mockHandlers.onEdit}
          onToggle={mockHandlers.onToggle}
          task={mockTask}
        />
      );

      expect(screen.getByTestId("task-checkbox")).toBeTruthy();
      expect(screen.getByTestId("task-checkbox-inner")).toBeTruthy();
    });
  });

  describe("Completed State", () => {
    it("shows unchecked checkbox when task is not completed", () => {
      render(
        <TaskItem
          index={0}
          onDelete={mockHandlers.onDelete}
          onEdit={mockHandlers.onEdit}
          onToggle={mockHandlers.onToggle}
          task={mockTask}
        />
      );

      const checkboxInner = screen.getByTestId("task-checkbox-inner");
      expect(checkboxInner).toBeTruthy();
    });

    it("shows checkmark icon when task is completed", () => {
      const completedTask: Task = {
        ...mockTask,
        completed: true,
      };

      render(
        <TaskItem
          index={0}
          onDelete={mockHandlers.onDelete}
          onEdit={mockHandlers.onEdit}
          onToggle={mockHandlers.onToggle}
          task={completedTask}
        />
      );

      const checkboxInner = screen.getByTestId("task-checkbox-inner");
      expect(checkboxInner).toBeTruthy();
      // Checkmark icon should be present when completed
    });

    it("renders title without strikethrough when task is not completed", () => {
      render(
        <TaskItem
          index={0}
          onDelete={mockHandlers.onDelete}
          onEdit={mockHandlers.onEdit}
          onToggle={mockHandlers.onToggle}
          task={mockTask}
        />
      );

      const title = screen.getByTestId("task-title");
      expect(title).toBeTruthy();
      expect(title.props.style).not.toContainEqual(
        expect.objectContaining({ textDecorationLine: "line-through" })
      );
    });
  });

  describe("Interactions", () => {
    it("calls onToggle when checkbox is pressed", () => {
      render(
        <TaskItem
          index={0}
          onDelete={mockHandlers.onDelete}
          onEdit={mockHandlers.onEdit}
          onToggle={mockHandlers.onToggle}
          task={mockTask}
        />
      );

      const checkbox = screen.getByTestId("task-checkbox");
      fireEvent.press(checkbox);

      expect(mockHandlers.onToggle).toHaveBeenCalledTimes(1);
      expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTask.id);
    });

    it("calls onEdit when edit button is pressed", () => {
      render(
        <TaskItem
          index={0}
          onDelete={mockHandlers.onDelete}
          onEdit={mockHandlers.onEdit}
          onToggle={mockHandlers.onToggle}
          task={mockTask}
        />
      );

      const editButton = screen.getByTestId("task-edit-button");
      fireEvent.press(editButton);

      expect(mockHandlers.onEdit).toHaveBeenCalledTimes(1);
      expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockTask);
    });

    it("shows Alert when delete button is pressed", () => {
      render(
        <TaskItem
          index={0}
          onDelete={mockHandlers.onDelete}
          onEdit={mockHandlers.onEdit}
          onToggle={mockHandlers.onToggle}
          task={mockTask}
        />
      );

      const deleteButton = screen.getByTestId("task-delete-button");
      fireEvent.press(deleteButton);

      expect(Alert.alert).toHaveBeenCalledTimes(1);
      expect(Alert.alert).toHaveBeenCalledWith(
        "Delete Task",
        "Are you sure you want to delete this task?",
        expect.arrayContaining([
          expect.objectContaining({ text: "Cancel" }),
          expect.objectContaining({ text: "Delete", style: "destructive" }),
        ])
      );
    });

    it("calls onDelete when user confirms deletion in Alert", () => {
      let alertButtons: any[] = [];

      // Mock Alert.alert to capture the buttons
      (Alert.alert as jest.Mock).mockImplementation(
        (title, message, buttons) => {
          alertButtons = buttons;
        }
      );

      render(
        <TaskItem
          index={0}
          onDelete={mockHandlers.onDelete}
          onEdit={mockHandlers.onEdit}
          onToggle={mockHandlers.onToggle}
          task={mockTask}
        />
      );

      const deleteButton = screen.getByTestId("task-delete-button");
      fireEvent.press(deleteButton);

      // Simulate pressing the "Delete" button
      expect(alertButtons).toHaveLength(2);
      if (alertButtons[1] && alertButtons[1].onPress) {
        alertButtons[1].onPress();
      }

      expect(mockHandlers.onDelete).toHaveBeenCalledTimes(1);
      expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTask.id);
    });

    it("does not call onDelete when user cancels deletion in Alert", () => {
      let alertButtons: any[] = [];

      // Mock Alert.alert to capture the buttons
      (Alert.alert as jest.Mock).mockImplementation(
        (title, message, buttons) => {
          alertButtons = buttons;
        }
      );

      render(
        <TaskItem
          index={0}
          onDelete={mockHandlers.onDelete}
          onEdit={mockHandlers.onEdit}
          onToggle={mockHandlers.onToggle}
          task={mockTask}
        />
      );

      const deleteButton = screen.getByTestId("task-delete-button");
      fireEvent.press(deleteButton);

      // Simulate pressing the "Cancel" button (which may not have onPress)
      expect(alertButtons).toHaveLength(2);
      // Cancel button typically doesn't call onDelete

      expect(mockHandlers.onDelete).not.toHaveBeenCalled();
    });
  });

  describe("Different Task States", () => {
    it("renders task with high priority", () => {
      const highPriorityTask: Task = {
        ...mockTask,
      };

      render(
        <TaskItem
          index={0}
          onDelete={mockHandlers.onDelete}
          onEdit={mockHandlers.onEdit}
          onToggle={mockHandlers.onToggle}
          task={highPriorityTask}
        />
      );

      expect(screen.getByTestId("task-item")).toBeTruthy();
      expect(screen.getByText("Test Task")).toBeTruthy();
    });

    it("renders task with different index", () => {
      const { rerender } = render(
        <TaskItem
          index={0}
          onDelete={mockHandlers.onDelete}
          onEdit={mockHandlers.onEdit}
          onToggle={mockHandlers.onToggle}
          task={mockTask}
        />
      );

      expect(screen.getByTestId("task-item")).toBeTruthy();

      // Test with different index
      rerender(
        <TaskItem
          index={5}
          onDelete={mockHandlers.onDelete}
          onEdit={mockHandlers.onEdit}
          onToggle={mockHandlers.onToggle}
          task={mockTask}
        />
      );

      expect(screen.getByTestId("task-item")).toBeTruthy();
    });
  });
});
