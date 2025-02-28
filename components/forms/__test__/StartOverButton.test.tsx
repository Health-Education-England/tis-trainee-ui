import { render, fireEvent, act } from "@testing-library/react";
import store from "../../../redux/store/store";
import { StartOverButton } from "../StartOverButton";
import { Provider } from "react-redux";
import {
  resetToInitFormA,
  updatedFormA,
  updatedNewFormId
} from "../../../redux/slices/formASlice";
import { formANew } from "../../../mock-data/draft-formr-parta";
import {
  updatedDraftFormProps,
  updatedFormsRefreshNeeded
} from "../../../redux/slices/formsSlice";
import { LifeCycleState } from "../../../models/LifeCycleState";
import { DraftFormProps } from "../../../utilities/FormBuilderUtilities";
import { useLocation } from "react-router-dom";
import history from "../../navigation/history";
import { updatedLtftFormsRefreshNeeded } from "../../../redux/slices/ltftSummaryListSlice";

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
  getDraftFormId: jest.fn(),
  isFormDeleted: jest.fn(),
  mapFormNameToUrl: jest.fn(),
  resetForm: jest.fn()
}));

jest.mock("../../navigation/history", () => ({
  push: jest.fn()
}));

describe("StartOverButton Component", () => {
  const renderStartOverButton = (props = {}) => {
    return render(
      <Provider store={store}>
        <StartOverButton formName="formA" btnLocation="form" {...props} />
      </Provider>
    );
  };

  beforeEach(() => {
    (useLocation as jest.Mock).mockReturnValue({ pathname: "/formr-a" });
    require("../../../utilities/FormBuilderUtilities").getDraftFormId.mockReturnValue(
      "123"
    );
    require("../../../utilities/FormBuilderUtilities").mapFormNameToUrl.mockReturnValue(
      "formr-a"
    );
  });

  it("should NOT render the StartOver button when NO formId is available and NO autosave success", () => {
    require("../../../utilities/FormBuilderUtilities").getDraftFormId.mockReturnValue(
      null
    );
    const { queryByRole } = renderStartOverButton();
    const startOverButton = queryByRole("button", {
      name: "Start over"
    });
    expect(startOverButton).not.toBeInTheDocument();
  });

  it("should render the StartOver button when initial autosave is successful (i.e. via stored newFormId on successful POST response)", () => {
    store.dispatch(updatedFormA(formANew));
    store.dispatch(updatedNewFormId("123"));
    const { queryByRole } = renderStartOverButton();
    const startOverButton = queryByRole("button", {
      name: "Start over"
    });
    expect(startOverButton).toBeInTheDocument();
  });

  it("should render the StartOver button when formId is available (i.e. from fetched draft form)", async () => {
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

  it("should render the StartOver button when btnLocation is 'formView' and NO formId is available", async () => {
    require("../../../utilities/FormBuilderUtilities").getDraftFormId.mockReturnValue(
      null
    );
    const { queryByRole } = renderStartOverButton({ btnLocation: "formView" });
    const startOverButton = queryByRole("button", {
      name: "Start over"
    });
    expect(startOverButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(startOverButton as HTMLElement);
    });

    expect(
      require("../../../utilities/FormBuilderUtilities").isFormDeleted
    ).not.toHaveBeenCalled();
    expect(history.push).toHaveBeenCalledWith("/formr-a");
  });

  it("should call isFormDeleted and checkPush when formId is available and form is deleted", async () => {
    require("../../../utilities/FormBuilderUtilities").isFormDeleted.mockResolvedValue(
      true
    );
    const { queryByRole } = renderStartOverButton();
    const startOverButton = queryByRole("button", {
      name: "Start over"
    });
    expect(startOverButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(startOverButton as HTMLElement);
    });

    expect(
      require("../../../utilities/FormBuilderUtilities").isFormDeleted
    ).toHaveBeenCalledWith("formA", "123");
    expect(history.push).toHaveBeenCalledWith("/formr-a");
  });

  it("should log 'startover failed' when formId is available and form is not deleted", async () => {
    console.log = jest.fn();
    require("../../../utilities/FormBuilderUtilities").isFormDeleted.mockResolvedValue(
      false
    );
    const { queryByRole } = renderStartOverButton();
    const startOverButton = queryByRole("button", {
      name: "Start over"
    });
    expect(startOverButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(startOverButton as HTMLElement);
    });

    expect(
      require("../../../utilities/FormBuilderUtilities").isFormDeleted
    ).toHaveBeenCalledWith("formA", "123");
    expect(console.log).toHaveBeenCalledWith("startover failed");
  });

  it("should call resetForm with the correct formName", () => {
    const { queryByRole } = renderStartOverButton();
    const startOverButton = queryByRole("button", {
      name: "Start over"
    });
    fireEvent.click(startOverButton as HTMLElement);

    expect(
      require("../../../utilities/FormBuilderUtilities").resetForm
    ).toHaveBeenCalledWith("formA");
  });

  it("should call redux dispatch (updatedFormsRefreshNeeded) when successful form delete triggered from 'start over' click on forms list page (CreateList comp)", async () => {
    const mockIsFormDeleted = jest.fn().mockResolvedValue(true);
    require("../../../utilities/FormBuilderUtilities").isFormDeleted.mockImplementationOnce(
      mockIsFormDeleted
    );
    const dispatchSpy = jest.spyOn(store, "dispatch");
    const { queryByRole } = renderStartOverButton({
      btnLocation: "formsList",
      formsListDraftId: "123"
    });
    const startOverButton = queryByRole("button", {
      name: "Start over"
    });

    await act(async () => {
      fireEvent.click(startOverButton as HTMLElement);
    });
    expect(mockIsFormDeleted).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith(updatedFormsRefreshNeeded(true));
    mockIsFormDeleted.mockReset();
    dispatchSpy.mockRestore();
  });

  it("should call redux dispatch (updatedLtftFormsRefreshNeeded) when btnLocation is 'formsList' and formName is 'ltft'", async () => {
    const mockIsFormDeleted = jest.fn().mockResolvedValue(true);
    require("../../../utilities/FormBuilderUtilities").isFormDeleted.mockImplementationOnce(
      mockIsFormDeleted
    );
    const dispatchSpy = jest.spyOn(store, "dispatch");
    const { queryByRole } = renderStartOverButton({
      formName: "ltft",
      btnLocation: "formsList",
      formsListDraftId: "123"
    });
    const startOverButton = queryByRole("button", {
      name: "Start over"
    });

    await act(async () => {
      fireEvent.click(startOverButton as HTMLElement);
    });
    expect(mockIsFormDeleted).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith(
      updatedLtftFormsRefreshNeeded(true)
    );
    mockIsFormDeleted.mockReset();
    dispatchSpy.mockRestore();
  });

  it("should navigate to the correct URL when btnLocation is not 'formsList'", async () => {
    const mockIsFormDeleted = jest.fn().mockResolvedValue(true);
    require("../../../utilities/FormBuilderUtilities").isFormDeleted.mockImplementationOnce(
      mockIsFormDeleted
    );
    const { queryByRole } = renderStartOverButton({
      formName: "formA",
      btnLocation: "formView",
      formsListDraftId: "123"
    });
    const startOverButton = queryByRole("button", {
      name: "Start over"
    });

    await act(async () => {
      fireEvent.click(startOverButton as HTMLElement);
    });
    expect(mockIsFormDeleted).toHaveBeenCalled();
    expect(history.push).toHaveBeenCalledWith("/formr-a");
    mockIsFormDeleted.mockReset();
  });
});
