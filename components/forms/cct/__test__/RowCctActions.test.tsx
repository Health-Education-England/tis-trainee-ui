import { render, screen, fireEvent } from "@testing-library/react";
import { RowCctActions } from "../CctSavedDraftsTable";
import store from "../../../../redux/store/store";
import { Provider } from "react-redux";
import { mockCctList } from "../../../../mock-data/mock-cct-data";

let mockIsLtftPilotEnabled = false;
let mockIsValidProgramme = true;

jest.mock("../../../../redux/store/store", () => ({
  __esModule: true,
  default: {
    dispatch: jest.fn(),
    getState: jest.fn(() => ({
      user: {
        features: {
          ltft: true,
          ltftProgrammes: ["some-id"]
        }
      }
    })),
    subscribe: jest.fn(() => jest.fn()),
    replaceReducer: jest.fn()
  }
}));

jest.mock("../../../../redux/slices/ltftSlice", () => ({
  setLtftCctSnapshot: jest.fn(() => "MOCK_LTFT_ACTION")
}));

jest.mock("../../../../utilities/hooks/useIsLtftPilot", () => ({
  useIsLtftPilot: () => mockIsLtftPilotEnabled
}));

jest.mock("../../../../utilities/ltftUtilities", () => ({
  isValidProgramme: () => mockIsValidProgramme,
  populateLtftDraft: jest.fn()
}));

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
  const mockSetIsModalOpen = jest.fn();
  const mockSetIsCctModalOpen = jest.fn();
  const mockSetCalcToDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsLtftPilotEnabled = false;
  });

  it("renders the delete button", () => {
    render(
      <Provider store={store}>
        <RowCctActions
          row={mockRow}
          setIsModalOpen={mockSetIsModalOpen}
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
          setIsModalOpen={mockSetIsModalOpen}
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

  describe("with LTFT pilot feature enabled", () => {
    beforeEach(() => {
      mockIsLtftPilotEnabled = true;
    });

    it("renders the LTFT button when LTFT pilot is enabled", () => {
      render(
        <Provider store={store}>
          <RowCctActions
            row={mockRow}
            setIsModalOpen={mockSetIsModalOpen}
            setIsCctModalOpen={mockSetIsCctModalOpen}
            setCalcToDelete={mockSetCalcToDelete}
          />
        </Provider>
      );

      const ltftButton = screen.getByRole("button", {
        name: /Apply for Changing hours/i
      });
      expect(ltftButton).toBeInTheDocument();
    });

    it("dispatches action and opens LTFT modal when LTFT button is clicked", () => {
      render(
        <Provider store={store}>
          <RowCctActions
            row={mockRow}
            setIsModalOpen={mockSetIsModalOpen}
            setIsCctModalOpen={mockSetIsCctModalOpen}
            setCalcToDelete={mockSetCalcToDelete}
          />
        </Provider>
      );

      const ltftButton = screen.getByRole("button", {
        name: /Apply for Changing hours/i
      });
      fireEvent.click(ltftButton);

      expect(store.dispatch).toHaveBeenCalledWith("MOCK_LTFT_ACTION");
      expect(mockSetIsModalOpen).toHaveBeenCalledWith(true);
    });
  });
});
