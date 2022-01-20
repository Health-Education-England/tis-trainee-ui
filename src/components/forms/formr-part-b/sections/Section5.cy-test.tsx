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
            saveDraft={() => Promise.resolve()}
            previousSection={null}
            handleSectionSubmit={() => Promise.resolve()}
          />
        </BrowserRouter>
      </Provider>
    );
    cy.get("[data-cy=errorAction]").should("exist");
  });
  it("should mount section 5", () => {
    const MockedSection5 = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedFormB(submittedFormRPartBs[0]));

      return (
        <Section5
          prevSectionLabel="Section 4"
          nextSectionLabel="Section 6"
          saveDraft={() => Promise.resolve()}
          previousSection={null}
          handleSectionSubmit={() => Promise.resolve()}
        />
      );
    };
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <MockedSection5 />
        </BrowserRouter>
      </Provider>
    );
    //TODO write some tests!!!
  });
});
