import { act } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LtftFormView } from "../LtftFormView";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import * as FormBuilderUtilities from "../../../../utilities/FormBuilderUtilities";
import { configureStore } from "@reduxjs/toolkit";
import { mockLtftFormObjAfterFirstSave } from "../../../../mock-data/mock-ltft-data";

jest.mock("../../../../utilities/FormBuilderUtilities");
jest.mock("../../../../utilities/hooks/useSelectFormData", () => ({
  useSelectFormData: () => ({
    ...mockLtftFormObjAfterFirstSave,
    cctDate: "2026-01-01"
  })
}));
jest.mock("../../../../utilities/hooks/useSubmitting", () => ({
  useSubmitting: () => ({
    startSubmitting: jest.fn(),
    stopSubmitting: jest.fn(),
    isSubmitting: false
  })
}));
jest.mock("../../form-builder/FormViewBuilder", () => ({
  __esModule: true,
  default: () => <div>Form Builder</div>
}));

jest.mock("../../StartOverButton", () => ({
  StartOverButton: () => <div>Start Over</div>
}));

jest.mock("../LtftStatusDetails", () => ({
  LtftStatusDetails: () => <div>Ltft Status Details</div>
}));

jest.mock("../../../forms/Declarations", () => {
  const React = require("react");
  const { useEffect } = React;

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

    expect(screen.queryByText("Please try again.")).not.toBeInTheDocument();

    await act(async () => {
      await user.type(
        screen.getByLabelText(/Please give your LTFT application a name/),
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

    expect(screen.queryByTestId("ltft-modal")).not.toBeInTheDocument();
  });
});
