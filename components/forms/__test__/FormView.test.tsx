import { render, act } from "@testing-library/react";
import { FormView } from "../form-builder/FormView";
import { FormName, FieldType } from "../form-builder/FormBuilder";
import * as FormRUtilities from "../../../utilities/FormRUtilities";
import * as FormBuilderUtilities from "../../../utilities/FormBuilderUtilities";
import { Provider } from "react-redux";
import store from "../../../redux/store/store";
import { BrowserRouter } from "react-router-dom";

jest.mock("../../../utilities/FormRUtilities", () => ({
  ...jest.requireActual("../../../utilities/FormRUtilities"),
  processLinkedFormData: jest.fn()
}));

jest.mock("../../../utilities/FormBuilderUtilities", () => ({
  ...jest.requireActual("../../../utilities/FormBuilderUtilities"),
  saveDraftForm: jest.fn()
}));

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
    declarations: [] // Required by Form type
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
    const { container } = render(
      <Provider store={store}>
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

    // Get FormView component instance
    const formViewInstance = FormView({
      formData: mockFormData,
      canEditStatus: true,
      formJson: mockFormJson,
      redirectPath: "/test"
    });

    // Get handleModalFormSubmit function
    const formLinkerModal = formViewInstance.props.children[8];
    const handleModalFormSubmit = formLinkerModal.props.onSubmit;

    // Call handleModalFormSubmit
    await act(async () => {
      handleModalFormSubmit(mockLinkedFormData);
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
