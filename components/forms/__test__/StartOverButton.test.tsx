import { render, screen, fireEvent, act } from "@testing-library/react";
import store from "../../../redux/store/store";
import { StartOverButton } from "../StartOverButton";
import { Provider } from "react-redux";
import {
  resetToInitFormA,
  updatedFormA
} from "../../../redux/slices/formASlice";
import { formASavedDraft } from "../../../mock-data/draft-formr-parta";
import { updatedDraftFormProps } from "../../../redux/slices/formsSlice";
import { LifeCycleState } from "../../../models/LifeCycleState";
import { DraftFormProps } from "../../../utilities/FormBuilderUtilities";

jest.mock("react-router-dom", () => ({
  useLocation: () => ({ pathname: "/formr-a" })
}));

describe("Startoverbtn Component", () => {
  const renderStartOverButton = () => {
    return render(
      <Provider store={store}>
        <StartOverButton />
      </Provider>
    );
  };
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
});
