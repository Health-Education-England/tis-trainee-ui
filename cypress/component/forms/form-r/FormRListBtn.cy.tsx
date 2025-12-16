import { mount } from "cypress/react";
import { Provider } from "react-redux";
import { Route, Router, Switch } from "react-router-dom";
import store from "../../../../redux/store/store";
import history from "../../../../components/navigation/history";
import FormRListBtn from "../../../../components/forms/form-builder/form-r/FormRListBtn";
import { updatedDraftFormProps } from "../../../../redux/slices/formsSlice";
import { updatedFormAStatus } from "../../../../redux/slices/formASlice";
import { LifeCycleState } from "../../../../models/LifeCycleState";

describe("FormRListBtn", () => {
  beforeEach(() => {
    store.dispatch(updatedDraftFormProps(null));
    store.dispatch(updatedFormAStatus("idle"));
  });

  it("should render 'Submit new form' when no draft exists", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <FormRListBtn pathName="/formr-a" />
        </Router>
      </Provider>
    );

    cy.get("button").should("contain.text", "Submit new form");
    cy.get("button").should("not.be.disabled");
  });

  it("should navigate to new form creation when 'Submit new form' is clicked", () => {
    history.push("/formr-a");
    mount(
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            <Route exact path="/formr-a">
              <FormRListBtn pathName="/formr-a" />
            </Route>
            <Route path="/formr-a/new/create">
              {/* Mock new form page */}
              <div data-cy="new-form-page">New Form Page</div>
            </Route>
          </Switch>
        </Router>
      </Provider>
    );
    cy.get("button").click();
    cy.get('[data-cy="new-form-page"]').should("exist");
    cy.url().should("include", "/formr-a/new/create");
  });

  it("should render 'Edit saved draft form' when a draft exists", () => {
    store.dispatch(
      updatedDraftFormProps({
        id: "draft-id-123",
        lifecycleState: LifeCycleState.Draft
      })
    );

    mount(
      <Provider store={store}>
        <Router history={history}>
          <FormRListBtn pathName="/formr-a" />
        </Router>
      </Provider>
    );

    cy.get("button").should("contain.text", "Edit saved draft form");
  });

  it("should navigate to existing draft when 'Edit saved draft form' is clicked", () => {
    store.dispatch(
      updatedDraftFormProps({
        id: "draft-id-123",
        lifecycleState: LifeCycleState.Draft
      })
    );
    history.push("/formr-a");

    mount(
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            <Route exact path="/formr-a">
              <FormRListBtn pathName="/formr-a" />
            </Route>
            <Route path="/formr-a/draft-id-123/create">
              <div data-cy="draft-form-page">Draft Form Page</div>
            </Route>
          </Switch>
        </Router>
      </Provider>
    );

    cy.get("button").click();
    cy.get('[data-cy="draft-form-page"]').should("exist");
    cy.url().should("include", "/formr-a/draft-id-123/create");
  });

  it("should render 'Edit unsubmitted form' when an unsubmitted form exists", () => {
    store.dispatch(
      updatedDraftFormProps({
        id: "unsubmitted-id-456",
        lifecycleState: LifeCycleState.Unsubmitted
      })
    );

    mount(
      <Provider store={store}>
        <Router history={history}>
          <FormRListBtn pathName="/formr-a" />
        </Router>
      </Provider>
    );

    cy.get("button").should("contain.text", "Edit unsubmitted form");
  });

  it("should be disabled when form status is 'deleting'", () => {
    store.dispatch(updatedFormAStatus("deleting"));

    mount(
      <Provider store={store}>
        <Router history={history}>
          <FormRListBtn pathName="/formr-a" />
        </Router>
      </Provider>
    );

    cy.get("button").should("be.disabled");
  });
});
