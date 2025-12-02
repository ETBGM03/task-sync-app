import EmptyState from "@/components/empty-state";
import { render, screen } from "@testing-library/react-native";

describe("EmptyState component", () => {
  describe("Rendering", () => {
    it("renders correctly with default props (no search query)", () => {
      render(<EmptyState />);

      expect(screen.getByText("No hay tareas")).toBeTruthy();
      expect(
        screen.getByText("Crea tu primera tarea presionando el botón +")
      ).toBeTruthy();
    });

    it("renders correctly with search query prop", () => {
      render(<EmptyState isSearchableQuery="test query" />);

      expect(screen.getByText("No se encontraron tareas")).toBeTruthy();
      expect(
        screen.getByText("Intenta con otros términos de búsqueda")
      ).toBeTruthy();
    });

    it("displays default empty state message when no search query is provided", () => {
      render(<EmptyState />);

      const title = screen.getByText("No hay tareas");
      const description = screen.getByText(
        "Crea tu primera tarea presionando el botón +"
      );

      expect(title).toBeTruthy();
      expect(description).toBeTruthy();
    });

    it("displays search empty state message when search query is provided", () => {
      render(<EmptyState isSearchableQuery="react native" />);

      const title = screen.getByText("No se encontraron tareas");
      const description = screen.getByText(
        "Intenta con otros términos de búsqueda"
      );

      expect(title).toBeTruthy();
      expect(description).toBeTruthy();
    });
  });
});
