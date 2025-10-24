/// <reference types="cypress" />
/// <reference path="../../../../cypress/support/index.d.ts" />

import { mount } from "cypress/react";
import { mockTraineeProfile } from "../../../../mock-data/trainee-profile";
import {
  COJ_START_DATE_BEFORE_EPOCH_ERROR_MESSAGE,
  NO_MATCHING_PM_ERROR_MESSAGE
} from "../../../../utilities/Constants";
import { CojVersionType } from "../../../../redux/slices/userSlice";
import { Provider } from "react-redux";
import store from "../../../../redux/store/store";
import { MemoryRouter } from "react-router-dom";
import CojView from "../../../../components/forms/conditionOfJoining/CojView";
import { updatedTraineeProfileData } from "../../../../redux/slices/traineeProfileSlice";
import { TraineeProfile } from "../../../../models/TraineeProfile";
import { FormsService } from "../../../../services/FormsService";

const pmId = mockTraineeProfile.programmeMemberships[0].tisId as string;

const mockProps = {
  mockTraineeProfileData: mockTraineeProfile,
  tisId: pmId,
  startDate: "2024-01-01",
  conditionsOfJoiningSignedAtDate: new Date("2025-01-01"),
  conditionsOfJoiningVersion: "GG9" as CojVersionType
};

const commonCheckboxes = [
  "isDeclareProvisional",
  "isDeclareSatisfy",
  "isDeclareProvide",
  "isDeclareInform",
  "isDeclareUpToDate",
  "isDeclareAttend",
  "isDeclareEngage"
];

const gg10Checkboxes = [...commonCheckboxes, "isDeclareContacted"];

const testCheckboxes = (
  checkboxes: string[],
  readonlyForm: boolean = false
) => {
  checkboxes.forEach(checkbox => {
    const element = cy.get(`[data-cy="${checkbox}"]`).should("exist");
    if (readonlyForm) {
      element.should("be.checked");
      element.should("have.attr", "readonly");
    } else {
      element.should("not.be.checked");
      element.check();
      element.should("be.checked");
    }
  });
};

const testUnsignedForm = (version: CojVersionType) => {
  const checkboxes = version === "GG10" ? gg10Checkboxes : commonCheckboxes;

  cy.get('[data-cy="cojSignedOn"]').should("not.exist");
  cy.get('[data-cy="cojSignBtn"]').should("exist").should("be.disabled");
  cy.get(`[data-cy="cojHeading-${version.toLowerCase()}"]`).should("exist");
  testCheckboxes(checkboxes);
  cy.get('[data-cy="cojSignBtn"]').should("not.be.disabled").click();
};

const testSignedForm = (version: CojVersionType) => {
  const checkboxes = version === "GG10" ? gg10Checkboxes : commonCheckboxes;

  cy.get(`[data-cy="cojHeading-${version.toLowerCase()}"]`).should("exist");
  cy.get('[data-cy="cojSignedOn"]').should(
    "contain.text",
    "Signed On: 01/01/2025"
  );
  cy.get("[data-cy=cogSignBtn]").should("not.exist");
  testCheckboxes(checkboxes, true);
};

const testPDFSaveButton = () => {
  cy.get("[data-cy=savePdfBtn]").click();
  cy.get("@downloadCojPdf").should("have.been.calledOnce");
};

type MockCojViewProps = {
  mockTraineeProfileData: TraineeProfile;
  tisId: string;
  startDate: string;
  conditionsOfJoiningSignedAtDate: Date | null;
  conditionsOfJoiningVersion: CojVersionType;
  urlTisId?: string;
};

const MockCojView: React.FC<MockCojViewProps> = ({
  mockTraineeProfileData,
  tisId,
  startDate,
  conditionsOfJoiningSignedAtDate,
  conditionsOfJoiningVersion,
  urlTisId
}) => {
  store.dispatch(
    updatedTraineeProfileData({
      ...mockTraineeProfileData,
      programmeMemberships: [
        {
          ...mockTraineeProfileData.programmeMemberships[0],
          tisId: tisId,
          startDate: startDate,
          conditionsOfJoining: {
            signedAt: conditionsOfJoiningSignedAtDate,
            version: conditionsOfJoiningVersion
          }
        }
      ]
    })
  );

  return (
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[`/programmes/${urlTisId ? urlTisId : tisId}/sign-coj`]}
      >
        <CojView />
      </MemoryRouter>
    </Provider>
  );
};

describe("Conditions of Joining View - errors", () => {
  it("renders the error message if no matching PM", () => {
    mount(<MockCojView {...mockProps} urlTisId="nonsense" />);

    cy.get('[data-cy="error-message-text"]').should(
      "have.text",
      NO_MATCHING_PM_ERROR_MESSAGE
    );
  });

  it("renders the 'please follow existing process' if PM start date before COJ epoch", () => {
    mount(<MockCojView {...mockProps} startDate="2000-01-01" />);

    cy.get('[data-cy="error-message-text"]').should(
      "have.text",
      COJ_START_DATE_BEFORE_EPOCH_ERROR_MESSAGE
    );
  });
});

describe("Conditions of Joining View - signed", () => {
  beforeEach(() => {
    cy.stub(FormsService.prototype, "downloadTraineeCojPdf").as(
      "downloadCojPdf"
    );
  });
  it("renders the readonly GG9 to view if matching PM, start date is after COJ epoch, and it has been signed", () => {
    mount(<MockCojView {...mockProps} />);
    testPDFSaveButton();
    testSignedForm("GG9");
  });

  it("renders the readonly GG10 to view if matching PM, start date is after COJ epoch, and it has been signed", () => {
    mount(
      <MockCojView
        {...mockProps}
        conditionsOfJoiningVersion={"GG10" as CojVersionType}
      />
    );
    testPDFSaveButton();
    testSignedForm("GG10");
  });
});

describe("Conditions of Joining View - unsigned", () => {
  it("renders the GG9 to sign if matching PM, start date is after COJ epoch, and it has not been signed", () => {
    mount(
      <MockCojView {...mockProps} conditionsOfJoiningSignedAtDate={null} />
    );
    testUnsignedForm("GG9");
  });

  it("renders the GG10 to sign if matching PM, start date is after COJ epoch, and it has not been signed", () => {
    mount(
      <MockCojView
        {...mockProps}
        conditionsOfJoiningSignedAtDate={null}
        conditionsOfJoiningVersion={"GG10" as CojVersionType}
      />
    );
    testUnsignedForm("GG10");
  });
});
