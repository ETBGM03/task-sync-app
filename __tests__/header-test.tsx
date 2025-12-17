import Header from "@/components/header";
import { fireEvent, render } from "@testing-library/react-native";

describe("<Header /> Component", () => {
  const mockHeaderProps = {
    completedCount: 0,
    totalCount: 0,
    handleCreateTask: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const customRender = () => render(<Header {...mockHeaderProps} />);

  it("should render correctly", () => {
    const { getByTestId } = customRender();

    const headerElement = getByTestId("header-title");
    const headerHelperCountElement = getByTestId("header-helper-count");
    const headerAddTaskElement = getByTestId("header-add-task");

    expect(headerElement).toBeDefined();
    expect(headerHelperCountElement).toBeDefined();
    expect(headerAddTaskElement).toBeDefined();
  });

  it("should call the handleCreateTask once time", () => {
    const { getByTestId } = customRender();
    const addTaskCountCalls = 1;

    const headerAddTaskElement = getByTestId("header-add-task");

    expect(headerAddTaskElement).toBeDefined();

    fireEvent.press(headerAddTaskElement);

    expect(mockHeaderProps.handleCreateTask).toHaveBeenCalled();
    expect(mockHeaderProps.handleCreateTask).toHaveBeenCalledTimes(
      addTaskCountCalls
    );
  });

  it("should call the handleCreateTask 0 time", () => {
    const { getByTestId } = render(
      <Header
        completedCount={mockHeaderProps.completedCount}
        totalCount={mockHeaderProps.totalCount}
      />
    );
    const addTaskCountCalls = 0;

    const headerAddTaskElement = getByTestId("header-add-task");

    expect(headerAddTaskElement).toBeDefined();

    expect(mockHeaderProps.handleCreateTask).toHaveBeenCalledTimes(
      addTaskCountCalls
    );
  });
});
