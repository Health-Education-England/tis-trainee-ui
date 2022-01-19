import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import { updatedFormB } from "../../../../redux/slices/formBSlice";
import store from "../../../../redux/store/store";
import Section5 from "./Section5";
import { submittedFormRPartBs } from "../../../../mock-data/submitted-formr-partb";

describe("Section 5", () => {
  it("should not render the form it no data", () => {
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <Section5
            prevSectionLabel=""
            nextSectionLabel=""
            saveDraft={() => null}
            previousSection={null}
            handleSectionSubmit={() => null}
          />
        </BrowserRouter>
      </Provider>
    );
    cy.get("[data-cy=errorAction]").should("exist");
  });
});
