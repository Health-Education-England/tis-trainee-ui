import React from "react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { mount } from "cypress/react";

import Routes from "../../../components/main/Routes";
import { updatedUserFeatures } from "../../../redux/slices/userSlice";
import { UserFeaturesType } from "../../../models/FeatureFlags";
import store from "../../../redux/store/store";
import {
  mockTraineeProfile,
  mockUserFeaturesNone,
  mockUserFeaturesSpecialty
} from "../../../mock-data/trainee-profile";
import { updatedTraineeProfileData } from "../../../redux/slices/traineeProfileSlice";
import { updatedReference } from "../../../redux/slices/referenceSlice";
import { mockedCombinedReference } from "../../../mock-data/combinedReferenceData";

const conditionalRoutes = [
  "/action-summary",
  "/placements",
  "/programmes",
  "/programmes/123/onboarding-tracker",
  "/programmes/123/sign-coj",
  "/profile",
  "/formr-a",
  "/formr-b",
  "/notifications",
  "/cct",
  "/ltft"
];

const unconditionalRoutes = [
  { route: "/home", contentRef: "tssOverview" },
  { route: "/support", contentRef: "supportHeading" },
  { route: "/mfa", contentRef: "mfaHeading" },
  { route: "/", contentRef: "tssOverview" },
  { route: "/does-not-exist", contentRef: "pageNotFoundText" }
];

store.dispatch(updatedTraineeProfileData(mockTraineeProfile));
store.dispatch(updatedReference(mockedCombinedReference));

const mountComponent = (route: string, userFeatures: UserFeaturesType) => {
  store.dispatch(updatedUserFeatures(userFeatures));
  mount(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Routes />
      </MemoryRouter>
    </Provider>
  );
};

describe("Routes", () => {
  describe("unconditional routes", () => {
    unconditionalRoutes.forEach(({ route, contentRef }) => {
      it(`should render ${contentRef} when navigating to ${route}`, () => {
        mountComponent(route, mockUserFeaturesNone);
        cy.get(`[data-cy="${contentRef}"]`).should("exist");
      });
    });
  });

  describe("disabled conditional routes", () => {
    conditionalRoutes.forEach(route => {
      it(`should redirect to PageNotFound when navigating to ${route}`, () => {
        mountComponent(route, mockUserFeaturesNone);
        cy.get('[data-cy="pageNotFoundText"]').should("exist");
      });
    });
  });

  describe("enabled conditional routes", () => {
    it("should render ActionSummary when navigating to /action-summary", () => {
      const features = {
        ...mockUserFeaturesSpecialty,
        actions: { enabled: true }
      };
      mountComponent("/action-summary", features);
      cy.get('[data-cy="actionSummaryHeading"]').should("exist");
    });

    it("should render Placements when navigating to /placements", () => {
      const features = {
        ...mockUserFeaturesSpecialty,
        details: {
          ...mockUserFeaturesSpecialty.details,
          placements: { enabled: true }
        }
      };
      mountComponent("/placements", features);
      cy.get('[data-cy="placementsHeading"]').should("exist");
    });

    it("should render Programmes when navigating to /programmes", () => {
      const features = {
        ...mockUserFeaturesSpecialty,
        details: {
          ...mockUserFeaturesSpecialty.details,
          programmes: {
            ...mockUserFeaturesSpecialty.details.programmes,
            enabled: true
          }
        }
      };
      mountComponent("/programmes", features);
      cy.get('[data-cy="programmemembershipsHeading"]').should("exist");
    });

    it("should render OnboardingTracker when navigating to /programmes/:id/onboarding-tracker", () => {
      const features = {
        ...mockUserFeaturesSpecialty,
        details: {
          ...mockUserFeaturesSpecialty.details,
          programmes: {
            ...mockUserFeaturesSpecialty.details.programmes,
            enabled: true
          }
        }
      };
      mountComponent(
        "/programmes/7ab1aae3-83c2-4bb6-b1f3-99146e79b362/onboarding-tracker",
        features
      );
      cy.get('[data-cy="onboardingTrackerHeading"]').should("exist");
    });

    it("should render CojView error page when navigating to /programmes/:id/sign-coj", () => {
      const features = {
        ...mockUserFeaturesSpecialty,
        details: {
          ...mockUserFeaturesSpecialty.details,
          programmes: {
            ...mockUserFeaturesSpecialty.details.programmes,
            conditionsOfJoining: { enabled: true }
          }
        }
      };
      mountComponent(
        "/programmes/7ab1aae3-83c2-4bb6-b1f3-99146e79b362/sign-coj",
        features
      );
      cy.get('[data-cy="error-header-text"]').should("exist");
      cy.get('[data-cy="error-message-text"]').should("exist");
    });

    it("should render Profile when navigating to /profile", () => {
      const features = {
        ...mockUserFeaturesSpecialty,
        details: {
          ...mockUserFeaturesSpecialty.details,
          profile: {
            ...mockUserFeaturesSpecialty.details.profile,
            enabled: true
          }
        }
      };
      mountComponent("/profile", features);
      cy.get('[data-cy="profileHeading"]').should("exist");
    });

    it("should render FormRPartA when navigating to /formr-a", () => {
      const features = {
        ...mockUserFeaturesSpecialty,
        forms: {
          ...mockUserFeaturesSpecialty.forms,
          formr: { enabled: true }
        }
      };
      mountComponent("/formr-a", features);
      cy.get('[data-cy="formRAHeading"]').should("exist");
    });

    it("should render FormRPartB when navigating to /formr-b", () => {
      const features = {
        ...mockUserFeaturesSpecialty,
        forms: {
          ...mockUserFeaturesSpecialty.forms,
          formr: { enabled: true }
        }
      };
      mountComponent("/formr-b", features);
      cy.get('[data-cy="formRBHeading"]').should("exist");
    });

    it("should render Notifications when navigating to /notifications", () => {
      const features = {
        ...mockUserFeaturesSpecialty,
        notifications: { enabled: true }
      };
      mountComponent("/notifications", features);
      cy.get('[data-cy="notificationsHeading"]').should("exist");
    });

    it("should render Cct when navigating to /cct", () => {
      const features = {
        ...mockUserFeaturesSpecialty,
        cct: { enabled: true }
      };
      mountComponent("/cct", features);
      cy.get('[data-cy="cct-header"]').should("exist");
    });

    it("should render Ltft when navigating to /ltft", () => {
      const features = {
        ...mockUserFeaturesSpecialty,
        forms: {
          ...mockUserFeaturesSpecialty.forms,
          ltft: {
            enabled: true,
            qualifyingProgrammes: []
          }
        }
      };
      mountComponent("/ltft", features);
      cy.get('[data-cy="ltftHeading"]').should("exist");
    });
  });
});
