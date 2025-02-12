import {
  mockTransformedCombinedReferenceData,
  mockedCombinedReference
} from "../../mock-data/combinedReferenceData";
import { mockForms } from "../../mock-data/formr-list";
import { mockTraineeProfile } from "../../mock-data/trainee-profile";
import { CombinedReferenceData } from "../../models/CombinedReferenceData";
import { LifeCycleState } from "../../models/LifeCycleState";
import { updatedTraineeProfileData } from "../../redux/slices/traineeProfileSlice";
import store from "../../redux/store/store";
import {
  getDraftFormId,
  handleSaveRedirect,
  setDraftFormProps,
  setFormDataForSubmit,
  transformReferenceData
} from "../FormBuilderUtilities";
import formAJson from "../../components/forms/form-builder/form-r/part-a/formA.json";
import { formANew } from "../../mock-data/draft-formr-parta";
import { Form } from "../../components/forms/form-builder/FormBuilder";
import { FormRPartA } from "../../models/FormRPartA";
import { FormRPartB } from "../../models/FormRPartB";
import history from "../../components/navigation/history";

describe("transformReferenceData", () => {
  beforeEach(() => {
    store.dispatch(updatedTraineeProfileData(mockTraineeProfile));
  });

  it("should transform reference data to a new format", () => {
    const data: CombinedReferenceData = mockedCombinedReference;
    const expected = mockTransformedCombinedReferenceData;
    const result = transformReferenceData(data);
    expect(result).toEqual(expected);
  });
});

describe("Get the latest 'draft' form version to open ", () => {
  // Test the draft form priority logic
  it("should return null if forms list is empty", () => {
    expect(setDraftFormProps([])).toBe(null);
  });

  it("should return null if forms list only contains submitted forms", () => {
    expect(setDraftFormProps(mockForms.slice(1, 3))).toBe(null);
  });

  it("should return the unsubmitted form", () => {
    expect(setDraftFormProps(mockForms)).toEqual({
      id: "3",
      lifecycleState: LifeCycleState.Unsubmitted
    });
  });

  it("should return the single draft form", () => {
    expect(setDraftFormProps(mockForms.slice(1, 4))).toEqual({
      id: "4",
      lifecycleState: LifeCycleState.Draft
    });
  });

  it("should return the most recent form between draft and local forms", () => {
    const forms = mockForms.slice(3, 5);
    expect(setDraftFormProps(forms)).toEqual({
      id: "4",
      lifecycleState: LifeCycleState.Draft
    });
  });
});

describe("Set formData for submit", () => {
  it("should set user-input hidden form fields to null before submit", () => {
    const result = setFormDataForSubmit(
      formAJson as Form,
      formANew as FormRPartA
    );
    expect((result as FormRPartA).cctSpecialty1).toBeNull();
    expect((result as FormRPartA).cctSpecialty2).toBeNull();
  });
});

describe("getDraftFormId", () => {
  it("should return formData.id if it exists for formA", () => {
    const formData: FormRPartA = {
      id: "123",
      traineeTisId: "456"
    } as FormRPartA;
    const formName = "formA";
    const result = getDraftFormId(formData, formName);
    expect(result).toBe("123");
  });

  it("should return newFormId from store if formData.id does not exist for formB", () => {
    const formData: FormRPartB = { traineeTisId: "456" } as FormRPartB;
    const formName = "formB";
    const mockState = {
      formB: {
        newFormId: "newFormBId"
      }
    };
    jest.spyOn(store, "getState").mockReturnValue(mockState as any);

    const result = getDraftFormId(formData, formName);
    expect(result).toBe("newFormBId");
  });
});

jest.mock("../../components/navigation/history");

describe("handleSaveRedirect", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should redirect to the correct path if autosaveStatus is 'succeeded' for formB", () => {
    const mockState = {
      formB: {
        saveStatus: "succeeded"
      }
    };
    jest.spyOn(store, "getState").mockReturnValue(mockState as any);

    handleSaveRedirect("formB", false);

    expect(history.push).toHaveBeenCalledWith("/formr-b");
  });
  it("should not redirect if isAutoSave is true", () => {
    handleSaveRedirect("formA", true);

    expect(history.push).not.toHaveBeenCalled();
  });
  it("should not redirect if autosaveStatus is not 'succeeded'", () => {
    const mockState = {
      formA: {
        saveStatus: "failed"
      }
    };
    jest.spyOn(store, "getState").mockReturnValue(mockState as any);

    handleSaveRedirect("formA", false);

    expect(history.push).not.toHaveBeenCalled();
  });
});
