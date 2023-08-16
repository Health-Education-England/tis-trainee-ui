import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import store from "../../../redux/store/store";
import history from "../../../components/navigation/history";
import {
  AutosaveMessage,
  AutosaveStatusProps
} from "../../../components/forms/AutosaveMessage";
import {
  updatedAutoSaveLatestTimeStamp,
  updatedAutosaveStatus
} from "../../../redux/slices/formASlice";
import { DateUtilities } from "../../../utilities/DateUtilities";

describe("AutosaveMessage", () => {
  const timeStamp = DateUtilities.NowToGbDateTimeString();
  const renderAutosaveMessage = (autosaveStatus: AutosaveStatusProps) => {
    const MockedAutosaveMessage = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedAutosaveStatus(autosaveStatus));
      return <AutosaveMessage formName="formA" />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedAutosaveMessage />
        </Router>
      </Provider>
    );
  };

  it("should render the 'idle' autosave message on first render", () => {
    renderAutosaveMessage("idle");
    cy.get('[data-cy="autosaveStatusMsg"]')
      .should("exist")
      .should("contain", "Autosave status: Waiting for new changes...");
  });
  it("should render the 'failed' autosave message and NO last successful timestamp when the form is saved unsuccessfully with no previous successful autosave.", () => {
    renderAutosaveMessage("failed");
    cy.get('[data-cy="autosaveStatusMsg"]')
      .should("exist")
      .should(
        "contain",
        `Autosave status: Fail (last autosave success: none this session)`
      );
  });
  it("should render the 'saving' autosave message when the form is being saved", () => {
    renderAutosaveMessage("saving");
    cy.get('[data-cy="autosaveStatusMsg"]')
      .should("exist")
      .should("contain", "Autosave status: In progress...");
  });
  it("should render the 'succeeded' autosave message when the form is saved successfully", () => {
    const MockedAutoSuccessMessage = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedAutosaveStatus("succeeded"));
      dispatch(updatedAutoSaveLatestTimeStamp(timeStamp));
      return <AutosaveMessage formName="formA" />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedAutoSuccessMessage />
        </Router>
      </Provider>
    );
    cy.get('[data-cy="autosaveStatusMsg"]')
      .should("exist")
      .should("contain", `Autosave status: Success (${timeStamp})`);
  });
  it("should render the 'failed' autosave message and last successful timestamp when the form is saved unsuccessfully after one successful autosave.", () => {
    renderAutosaveMessage("failed");
    cy.get('[data-cy="autosaveStatusMsg"]')
      .should("exist")
      .should(
        "contain",
        `Autosave status: Fail (last autosave success: ${timeStamp})`
      );
  });
});
