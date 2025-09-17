import { act } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormView } from "../form-builder/FormView";
import { FormName, FieldType } from "../form-builder/FormBuilder";
import * as FormRUtilities from "../../../utilities/FormRUtilities";
import * as FormBuilderUtilities from "../../../utilities/FormBuilderUtilities";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";

// Mock the hell out of everything rather than using requireActual which was causing circular dependency issues
jest.mock("../../../utilities/FormRUtilities", () => ({
  FormRUtilities: {
    displaySubmissionDate: jest.fn(),
    makeWarningText: jest.fn(() => "Warning text")
  },
  processLinkedFormData: jest.fn(),
  makeWarningText: jest.fn(() => "Warning text")
}));

jest.mock("../../../utilities/FormBuilderUtilities", () => ({
  saveDraftForm: jest.fn(),
  createErrorObject: jest.fn(),
  validateFields: jest.fn(() => Promise.resolve())
}));

jest.mock("../../navigation/history", () => ({
  __esModule: true,
  default: { push: jest.fn() }
}));

jest.mock("../ScrollTo", () => ({
  __esModule: true,
  default: () => <div>ScrollTo</div>
}));

jest.mock("../FormSavePDF", () => ({
  __esModule: true,
  default: () => <div>FormSavePDF</div>
}));

jest.mock("../StartOverButton", () => ({
  StartOverButton: () => <div>StartOverButton</div>
}));

jest.mock("../form-builder/FormViewBuilder", () => ({
  __esModule: true,
  default: () => <div>FormViewBuilder</div>
}));

jest.mock("../form-builder/Declarations", () => {
  const React = require("react");
  const { useEffect } = React;

  const MockDeclarations = ({
    setCanSubmit
  }: {
    setCanSubmit: (value: boolean) => void;
  }) => {
    useEffect(() => {
      setCanSubmit(true);
    }, [setCanSubmit]);

    return <div>Declarations</div>;
  };

  return {
    __esModule: true,
    default: MockDeclarations
  };
});

jest.mock("../form-linker/FormLinkerModal", () => ({
  FormLinkerModal: ({
    onSubmit,
    isOpen,
    onClose
  }: {
    onSubmit: (data: any) => void;
    isOpen: boolean;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div data-testid="form-linker-modal">
        <button
          onClick={() =>
            onSubmit({
              isArcp: false,
              programmeMembershipId: "pm1",
              localOfficeName: "London"
            })
          }
        >
          Submit Modal
        </button>
        <button onClick={onClose}>Close Modal</button>
      </div>
    ) : null
}));

jest.mock("../form-linker/FormLinkerSummary", () => ({
  FormLinkerSummary: () => <div>FormLinkerSummary</div>
}));

jest.mock("../../../utilities/StringUtilities", () => ({
  StringUtilities: {
    convertToBool: jest.fn(value => Boolean(value))
  }
}));

const testStore = configureStore({
  reducer: (
    state = {
      traineeProfile: { traineeProfileData: { programmeMemberships: [] } }
    }
  ) => state
});

describe("FormView", () => {
  const formName: FormName = "formA";
  const fieldType: FieldType = "text";
  const mockFormJson = {
    name: formName,
    pages: [
      {
        pageName: "Test Page",
        sections: [
          {
            sectionHeader: "Test Section",
            fields: [
              {
                name: "programmeName",
                label: "Programme Name",
                type: fieldType,
                visible: true
              }
            ]
          }
        ]
      }
    ],
    declarations: []
  };

  const mockFormData = {
    traineeTisId: "123",
    isArcp: false,
    programmeMembershipId: "pm1",
    localOfficeName: "London"
  };

  const mockLinkedFormData = {
    isArcp: false,
    programmeMembershipId: "pm1",
    localOfficeName: "London"
  };

  const mockProcessedData = {
    isArcp: false,
    programmeMembershipId: "pm1",
    localOfficeName: "London",
    linkedProgramme: {
      programmeName: "Test Programme"
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (FormRUtilities.processLinkedFormData as jest.Mock).mockReturnValue(
      mockProcessedData
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should populate programmeName when modal form is submitted", async () => {
    const user = userEvent.setup();

    render(
      <Provider store={testStore}>
        <BrowserRouter>
          <FormView
            formData={mockFormData}
            canEditStatus={true}
            formJson={mockFormJson}
            redirectPath="/test"
          />
        </BrowserRouter>
      </Provider>
    );

    // Click the submit button to open the modal
    const submitButton = screen.getByText("Submit Form");
    await act(async () => {
      await user.click(submitButton);
    });

    // Verify modal is open
    expect(screen.getByTestId("form-linker-modal")).toBeInTheDocument();

    // Click the modal submit button
    const modalSubmitButton = screen.getByText("Submit Modal");
    await act(async () => {
      // imported act directly from react because testing-library's act uses deprecated DOM test utils version
      await user.click(modalSubmitButton);
    });

    // Check if processLinkedFormData was called with correct params
    expect(FormRUtilities.processLinkedFormData).toHaveBeenCalledWith(
      mockLinkedFormData,
      []
    );

    // Check if saveDraftForm was called with correct updated form data
    expect(FormBuilderUtilities.saveDraftForm).toHaveBeenCalledWith(
      mockFormJson,
      {
        ...mockFormData,
        isArcp: mockProcessedData.isArcp,
        programmeMembershipId: mockProcessedData.programmeMembershipId,
        localOfficeName: mockProcessedData.localOfficeName,
        programmeSpecialty: mockProcessedData.linkedProgramme.programmeName,
        programmeName: mockProcessedData.linkedProgramme.programmeName
      },
      false,
      true
    );
  });
});
