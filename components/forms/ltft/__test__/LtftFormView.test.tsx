import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LtftFormView } from "../LtftFormView";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import * as FormBuilderUtilities from "../../../../utilities/FormBuilderUtilities";
import { mockLtftDraft0 } from "../../../../mock-data/mock-ltft-data";
import { configureStore } from "@reduxjs/toolkit";

jest.mock("../../../../utilities/FormBuilderUtilities");
jest.mock("../../../../utilities/hooks/useSelectFormData", () => ({
  useSelectFormData: () => mockLtftDraft0
}));
jest.mock("../../../../utilities/hooks/useSubmitting", () => ({
  useSubmitting: () => ({
    startSubmitting: jest.fn(),
    stopSubmitting: jest.fn(),
    isSubmitting: false
  })
}));
jest.mock("../../cct/CctCalcSummary", () => ({
  CctCalcSummaryDetails: () => <div>CCT Summary</div>
}));
jest.mock("../../form-builder/FormViewBuilder", () => ({
  __esModule: true,
  default: () => <div>Form Builder</div>
}));

// Note: Mock the Declarations via factory to avoid the need to interact with the form to set canSubmit to true
jest.mock("../../../forms/Declarations", () => {
  const React = require("react"); // Import React within the factory
  const { useEffect } = React;

  // Define the component here inside the factory function
  const MockDeclarations = ({
    setCanSubmit
  }: {
    setCanSubmit: (value: boolean) => void;
  }) => {
    useEffect(() => {
      setCanSubmit(true);
    }, [setCanSubmit]);

    return <div>Declarations</div>;
  };

  return {
    __esModule: true,
    default: MockDeclarations
  };
});

// Simplified modal mock as we only need to check if it renders or not. (full functionality tested in LtftNameModal.test.tsx)
jest.mock("../../../common/ActionModal", () => ({
  ActionModal: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="ltft-modal">Modal Content</div> : null
}));

// Mock store setup
let mockStoreState = {
  ltft: { canEdit: true, saveStatus: "idle" }
};

jest.mock("../../../../redux/store/store", () => ({
  __esModule: true,
  default: {
    dispatch: jest.fn(),
    getState: jest.fn(() => mockStoreState),
    subscribe: jest.fn(),
    replaceReducer: jest.fn()
  }
}));

// Simple Redux store for Provider
const testStore = configureStore({
  reducer: (state = mockStoreState) => state
});

describe("LtftFormView - Modal Display Tests", () => {
  let user: ReturnType<typeof userEvent.setup>;

  const setupTest = async () => {
    const history = createMemoryHistory();
    user = userEvent.setup();

    render(
      <Provider store={testStore}>
        <Router history={history}>
          <LtftFormView />
        </Router>
      </Provider>
    );

    // Since declarations are auto-approved in our mock via useEffect, just type name and submit
    await act(async () => {
      await user.type(
        screen.getByLabelText(/Please give your Changing hours/),
        "Test Application"
      );
    });

    await act(async () => {
      await user.click(screen.getByText("Submit"));
    });

    expect(FormBuilderUtilities.saveDraftForm).toHaveBeenCalled();
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockStoreState = {
      ltft: { canEdit: true, saveStatus: "idle" }
    };
  });

  it("should open modal when form submission is successful", async () => {
    (FormBuilderUtilities.saveDraftForm as jest.Mock).mockImplementation(() => {
      mockStoreState = {
        ltft: { canEdit: true, saveStatus: "succeeded" }
      };
      return Promise.resolve();
    });

    await setupTest();

    await waitFor(() => {
      expect(screen.getByTestId("ltft-modal")).toBeInTheDocument();
    });
  });

  it("should NOT open modal when form submission fails", async () => {
    (FormBuilderUtilities.saveDraftForm as jest.Mock).mockImplementation(() => {
      mockStoreState = {
        ltft: { canEdit: true, saveStatus: "failed" }
      };
      return Promise.resolve();
    });

    await setupTest();

    await waitFor(() => {
      expect(mockStoreState.ltft.saveStatus).toBe("failed");
    });

    // Verify the modal is NOT present
    expect(screen.queryByTestId("ltft-modal")).not.toBeInTheDocument();
  });
});
