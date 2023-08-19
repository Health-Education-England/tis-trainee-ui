import { render, screen, fireEvent, act } from "@testing-library/react";
import store from "../../../redux/store/store";
import { StartOverButton } from "../StartOverButton";
import { Provider } from "react-redux";
import {
  resetToInitFormA,
  updatedFormA
} from "../../../redux/slices/formASlice";
import { formASavedDraft } from "../../../mock-data/draft-formr-parta";
import {
  updatedDraftFormProps,
  updatedFormsRefreshNeeded
} from "../../../redux/slices/formsSlice";
import { LifeCycleState } from "../../../models/LifeCycleState";
import { DraftFormProps } from "../../../utilities/FormBuilderUtilities";
import { useLocation } from "react-router-dom";
import history from "../../navigation/history";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn()
}));

jest.mock("material-ui-confirm", () => ({
  useConfirm: () => {
    return () => {
      return new Promise((resolve: any, _reject) => {
        // Simulate the user clicking "OK" on the confirm modal
        resolve();
      });
    };
  }
}));

jest.mock("../../../utilities/FormBuilderUtilities", () => ({
  isFormDeleted: jest.fn()
}));

jest.mock("../../navigation/history", () => ({
  push: jest.fn()
}));

describe("Startoverbtn Component", () => {
  const renderStartOverButton = () => {
    return render(
      <Provider store={store}>
        <StartOverButton />
      </Provider>
    );
  };

  beforeEach(() => {
    (useLocation as jest.Mock).mockReturnValue({ pathname: "/formr-a" });
  });

  it("should NOT render the Startover button when NO formId is available and NO autosave success", () => {
    const startOverButton = screen.queryByRole("button", {
      name: "Start over"
    });
    expect(startOverButton).not.toBeInTheDocument();
  });

  it("Should render the Startover button when autosave is successful (i.e. form data includes form id via autosave response data).", () => {
    store.dispatch(updatedFormA(formASavedDraft));
    const { queryByRole } = renderStartOverButton();
    const startOverButton = queryByRole("button", {
      name: "Start over"
    });
    expect(startOverButton).toBeInTheDocument();
  });

  it("Should render the Startover button when formId is available (i.e. from fetched draft form).", () => {
    const draftProps: DraftFormProps = {
      id: "123",
      lifecycleState: LifeCycleState.Draft
    };
    store.dispatch(resetToInitFormA());
    store.dispatch(updatedDraftFormProps(draftProps));
    const { queryByRole } = renderStartOverButton();
    const startOverButton = queryByRole("button", {
      name: "Start over"
    });
    expect(startOverButton).toBeInTheDocument();
  });

  it("should call history.push when successful form delete triggered from 'start over' click on forms page (pathname ends with 'create').", async () => {
    (useLocation as jest.Mock).mockReturnValue({ pathname: "/formr-a/create" });
    const mockIsFormDeleted = jest.fn().mockResolvedValue(true);
    require("../../../utilities/FormBuilderUtilities").isFormDeleted.mockImplementationOnce(
      mockIsFormDeleted
    );
    const { queryByRole } = renderStartOverButton();
    const startOverButton = queryByRole("button", {
      name: "Start over"
    });

    await act(async () => {
      fireEvent.click(startOverButton as HTMLElement);
    });
    expect(mockIsFormDeleted).toHaveBeenCalled();
    expect(history.push).toHaveBeenCalledWith("/formr-a");
  });

  it("should call redux dispatch (updatedFormsRefreshNeeded) when successful form delete triggered from 'start over' click on forms list page (CreateList comp).", async () => {
    const mockIsFormDeleted = jest.fn().mockResolvedValue(true);
    require("../../../utilities/FormBuilderUtilities").isFormDeleted.mockImplementationOnce(
      mockIsFormDeleted
    );
    const dispatchSpy = jest.spyOn(store, "dispatch");
    const { queryByRole } = renderStartOverButton();
    const startOverButton = queryByRole("button", {
      name: "Start over"
    });

    await act(async () => {
      fireEvent.click(startOverButton as HTMLElement);
    });
    expect(mockIsFormDeleted).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith(updatedFormsRefreshNeeded(true));
    mockIsFormDeleted.mockReset();
  });

  it('should console.log("startover failed") for an unsuccessful form delete (when isFormDeleted returns false)', async () => {
    const mockIsFormDeleted = jest.fn().mockResolvedValue(false);
    require("../../../utilities/FormBuilderUtilities").isFormDeleted.mockImplementationOnce(
      mockIsFormDeleted
    );
    const consoleSpy = jest.spyOn(console, "log");
    const { queryByRole } = renderStartOverButton();
    const startOverButton = queryByRole("button", {
      name: "Start over"
    });
    await act(async () => {
      fireEvent.click(startOverButton as HTMLElement);
    });
    expect(consoleSpy).toHaveBeenCalledWith("startover failed");
  });
});
