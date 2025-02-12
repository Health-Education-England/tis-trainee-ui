import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import store from "../../../redux/store/store";
import history from "../../../components/navigation/history";
import {
  AutosaveMessage,
  SaveStatusProps
} from "../../../components/forms/AutosaveMessage";
import {
  updatedSaveLatestTimeStamp,
  updatedSaveStatus
} from "../../../redux/slices/formASlice";
import { DateUtilities } from "../../../utilities/DateUtilities";

describe("AutosaveMessage", () => {
  const lastModDate: string = "2023-09-26T09:54:27.47";
  const timeStamp = DateUtilities.ConvertToLondonTime(lastModDate, true);
  const renderAutosaveMessage = (autosaveStatus: SaveStatusProps) => {
    const MockedAutosaveMessage = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedSaveStatus(autosaveStatus));
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
        `Autosave status: Fail - Last autosave success: none this session`
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
      dispatch(updatedSaveStatus("succeeded"));
      dispatch(updatedSaveLatestTimeStamp(timeStamp));
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
      .should("contain", `Autosave status: Success - ${timeStamp}`);
  });
  it("should render the 'failed' autosave message and last successful timestamp when the form is saved unsuccessfully after one successful autosave.", () => {
    renderAutosaveMessage("failed");
    cy.get('[data-cy="autosaveStatusMsg"]')
      .should("exist")
      .should(
        "contain",
        `Autosave status: Fail - Last autosave success: ${timeStamp}`
      );
  });
});
