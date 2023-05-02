import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { MemoryRouter, Router } from "react-router-dom";
import GlobalAlert from "../../../components/main/GlobalAlert";
import history from "../../../components/navigation/history";
import {
  mockPersonalDetails,
  mockProgrammeMembershipCojNotSigned,
  mockProgrammeMembershipCojSigned
} from "../../../mock-data/trainee-profile";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import { updatedTraineeProfileData } from "../../../redux/slices/traineeProfileSlice";
import store from "../../../redux/store/store";
import React from "react";
import { COJ_EPOCH } from "../../../utilities/Constants";

describe("GlobalAlert", () => {
  beforeEach(() => {
    cy.clock(COJ_EPOCH);
  });

  it("should not render when no alerts", () => {
    const MockedGlobalAlert = () => {
      const dispatch = useAppDispatch();
      dispatch(
        updatedTraineeProfileData({
          traineeTisId: "12345",
          personalDetails: mockPersonalDetails,
          programmeMemberships: [mockProgrammeMembershipCojSigned],
          placements: []
        })
      );
      return <GlobalAlert />;
    };

    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedGlobalAlert />
        </Router>
      </Provider>
    );

    cy.get("[data-cy=globalAlert]").should("not.exist");
  });

  it("should render when alerts available", () => {
    const MockedGlobalAlert = () => {
      const dispatch = useAppDispatch();
      dispatch(
        updatedTraineeProfileData({
          traineeTisId: "12345",
          personalDetails: mockPersonalDetails,
          programmeMemberships: [
            {
              ...mockProgrammeMembershipCojNotSigned,
              startDate: COJ_EPOCH
            }
          ],
          placements: []
        })
      );
      return <GlobalAlert />;
    };

    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedGlobalAlert />
        </Router>
      </Provider>
    );

    cy.get("[data-cy=globalAlert]").should("exist");
  });

  describe("CojAlert", () => {
    it("should not render when no signable COJ", () => {
      const MockedGlobalAlert = () => {
        const dispatch = useAppDispatch();
        dispatch(
          updatedTraineeProfileData({
            traineeTisId: "12345",
            personalDetails: mockPersonalDetails,
            programmeMemberships: [mockProgrammeMembershipCojSigned],
            placements: []
          })
        );
        return <GlobalAlert />;
      };

      mount(
        <Provider store={store}>
          <Router history={history}>
            <MockedGlobalAlert />
          </Router>
        </Provider>
      );

      cy.get("[data-cy=cojAlert]").should("not.exist");
    });

    it("should render when signable COJ available", () => {
      const MockedGlobalAlert = () => {
        const dispatch = useAppDispatch();
        dispatch(
          updatedTraineeProfileData({
            traineeTisId: "12345",
            personalDetails: mockPersonalDetails,
            programmeMemberships: [
              {
                ...mockProgrammeMembershipCojNotSigned,
                startDate: COJ_EPOCH
              }
            ],
            placements: []
          })
        );
        return <GlobalAlert />;
      };

      mount(
        <Provider store={store}>
          <Router history={history}>
            <MockedGlobalAlert />
          </Router>
        </Provider>
      );

      cy.get("[data-cy=cojAlert]").should("exist");
    });

    it("should include programmes nav link when not on programmes view", () => {
      const MockedGlobalAlert = () => {
        const dispatch = useAppDispatch();
        dispatch(
          updatedTraineeProfileData({
            traineeTisId: "12345",
            personalDetails: mockPersonalDetails,
            programmeMemberships: [
              {
                ...mockProgrammeMembershipCojNotSigned,
                startDate: COJ_EPOCH
              }
            ],
            placements: []
          })
        );
        return <GlobalAlert />;
      };

      mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/home"]}>
            <MockedGlobalAlert />
          </MemoryRouter>
        </Provider>
      );

      cy.get("[data-cy=cojLink]").should("exist");
    });

    it("should not include programmes nav link when on programmes view", () => {
      const MockedGlobalAlert = () => {
        const dispatch = useAppDispatch();
        dispatch(
          updatedTraineeProfileData({
            traineeTisId: "12345",
            personalDetails: mockPersonalDetails,
            programmeMemberships: [
              {
                ...mockProgrammeMembershipCojNotSigned,
                startDate: COJ_EPOCH
              }
            ],
            placements: []
          })
        );
        return <GlobalAlert />;
      };

      mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/programmes"]}>
            <MockedGlobalAlert />
          </MemoryRouter>
        </Provider>
      );

      cy.get("[data-cy=cojLink]").should("not.exist");
    });
    it("should not render the Coj alert when on the Coj form page", () => {
      mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/121/sign-coj"]}>
            <GlobalAlert />
          </MemoryRouter>
        </Provider>
      );
      cy.get("[data-cy=cojAlert]").should("not.exist");
    });
  });
});
