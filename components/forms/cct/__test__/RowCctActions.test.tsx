import { render, screen, fireEvent } from "@testing-library/react";
import { RowCctActions } from "../CctSavedDraftsTable";
import store from "../../../../redux/store/store";
import { Provider } from "react-redux";
import { mockCctList } from "../../../../mock-data/mock-cct-data";

jest.mock("../../../../components/navigation/history", () => ({
  push: jest.fn()
}));

jest.mock("../../../../utilities/hooks/useSubmitting", () => ({
  useSubmitting: () => ({
    isSubmitting: false,
    startSubmitting: jest.fn(),
    stopSubmitting: jest.fn()
  })
}));

describe("RowCctActions component", () => {
  const mockRow = mockCctList[0];
  const mockSetIsCctModalOpen = jest.fn();
  const mockSetCalcToDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the delete button", () => {
    render(
      <Provider store={store}>
        <RowCctActions
          row={mockRow}
          setIsCctModalOpen={mockSetIsCctModalOpen}
          setCalcToDelete={mockSetCalcToDelete}
        />
      </Provider>
    );

    const deleteButton = screen.getByRole("button", { name: /Delete/i });
    expect(deleteButton).toBeInTheDocument();
  });

  it("sets calculation ID and opens CCT delete modal when delete button is clicked", () => {
    render(
      <Provider store={store}>
        <RowCctActions
          row={mockRow}
          setIsCctModalOpen={mockSetIsCctModalOpen}
          setCalcToDelete={mockSetCalcToDelete}
        />
      </Provider>
    );

    const deleteButton = screen.getByRole("button", { name: /Delete/i });
    fireEvent.click(deleteButton);

    expect(mockSetCalcToDelete).toHaveBeenCalledWith(mockRow.id);
    expect(mockSetIsCctModalOpen).toHaveBeenCalledWith(true);
  });
});
