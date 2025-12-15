import { act } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormRView } from "../form-builder/form-r/FormRView";
import { FormName, FieldType } from "../form-builder/FormBuilder";
import * as FormRUtilities from "../../../utilities/FormRUtilities";
import * as FormBuilderUtilities from "../../../utilities/FormBuilderUtilities";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import formAJson from "../form-builder/form-r/part-a/formA.json";

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

jest.mock("../../forms/Declarations", () => {
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

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(() => ({ id: undefined })),
  useLocation: jest.fn(() => ({ state: {} }))
}));

jest.mock("../../../redux/hooks/hooks", () => ({
  useAppDispatch: jest.fn(() => jest.fn()),
  useAppSelector: jest.fn()
}));

const testStore = configureStore({
  reducer: (
    state = {
      traineeProfile: { traineeProfileData: { programmeMemberships: [] } },
      formA: { status: "succeeded" },
      formB: { status: "succeeded", displayCovid: false }
    }
  ) => state
});

describe("FormRView", () => {
  const formName: FormName = "formA";
  const fieldType: FieldType = "text";

  const mockFormData = {
    traineeTisId: "123",
    isArcp: false,
    programmeMembershipId: "pm1",
    localOfficeName: "London",
    lifecycleState: "DRAFT"
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
    const mockUseAppSelector =
      require("../../../redux/hooks/hooks").useAppSelector;
    mockUseAppSelector.mockImplementation((selector: any) => {
      if (selector.toString().includes("formB.displayCovid")) return false;
      if (selector.toString().includes("formA.status")) return "succeeded";
      if (selector.toString().includes("formB.status")) return "succeeded";
      if (
        selector
          .toString()
          .includes("traineeProfile.traineeProfileData.programmeMemberships")
      )
        return [];
      return mockFormData;
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should populate programmeName when modal form is submitted", async () => {
    const user = userEvent.setup();

    render(
      <Provider store={testStore}>
        <BrowserRouter>
          <FormRView formType="A" />
        </BrowserRouter>
      </Provider>
    );

    const submitButton = screen.getByText("Submit Form");
    await act(async () => {
      await user.click(submitButton);
    });

    expect(screen.getByTestId("form-linker-modal")).toBeInTheDocument();

    const modalSubmitButton = screen.getByText("Submit Modal");
    await act(async () => {
      await user.click(modalSubmitButton);
    });

    expect(FormRUtilities.processLinkedFormData).toHaveBeenCalledWith(
      mockLinkedFormData,
      []
    );

    expect(FormBuilderUtilities.saveDraftForm).toHaveBeenCalledWith(
      formAJson,
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
