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
  BtnLocation,
  checkPush,
  chooseRedirectPath,
  getDraftFormId,
  handleSaveRedirect,
  setDraftFormRProps,
  setFormRDataForSubmit,
  transformReferenceData
} from "../FormBuilderUtilities";
import formAJson from "../../components/forms/form-builder/form-r/part-a/formA.json";
import { formANew } from "../../mock-data/draft-formr-parta";
import {
  Form,
  FormName
} from "../../components/forms/form-builder/FormBuilder";
import { FormRPartA } from "../../models/FormRPartA";
import { FormRPartB } from "../../models/FormRPartB";
import history from "../../components/navigation/history";
import { updatedFormsRefreshNeeded } from "../../redux/slices/formsSlice";
import { updatedLtftFormsRefreshNeeded } from "../../redux/slices/ltftSummaryListSlice";

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
    expect(setDraftFormRProps([])).toBe(null);
  });

  it("should return null if forms list only contains submitted forms", () => {
    expect(setDraftFormRProps(mockForms.slice(1, 3))).toBe(null);
  });

  it("should return the unsubmitted form", () => {
    expect(setDraftFormRProps(mockForms)).toEqual({
      id: "3",
      lifecycleState: LifeCycleState.Unsubmitted
    });
  });

  it("should return the single draft form", () => {
    expect(setDraftFormRProps(mockForms.slice(1, 4))).toEqual({
      id: "4",
      lifecycleState: LifeCycleState.Draft
    });
  });

  it("should return the most recent form between draft and local forms", () => {
    const forms = mockForms.slice(3, 5);
    expect(setDraftFormRProps(forms)).toEqual({
      id: "4",
      lifecycleState: LifeCycleState.Draft
    });
  });
});

describe("Set formData for submit", () => {
  it("should set user-input hidden form fields to null before submit", () => {
    const result = setFormRDataForSubmit(
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

  // Test successful redirects for all form types
  const successCases = [
    { formName: "formA", path: "/formr-a" },
    { formName: "formB", path: "/formr-b" },
    { formName: "ltft", path: "/ltft" }
  ];

  successCases.forEach(({ formName, path }) => {
    it(`should redirect to ${path} when saveStatus is 'succeeded' for ${formName}`, () => {
      const mockState = {
        [formName]: { saveStatus: "succeeded" }
      };
      jest.spyOn(store, "getState").mockReturnValue(mockState as any);

      handleSaveRedirect(formName as FormName, true);

      expect(history.push).toHaveBeenCalledWith(path);
    });
  });

  // Test saveStatus values
  const saveStatusCases = ["idle", "failed"];

  saveStatusCases.forEach(status => {
    it(`should not redirect when saveStatus is '${status}'`, () => {
      const mockState = {
        formA: { saveStatus: status }
      };
      jest.spyOn(store, "getState").mockReturnValue(mockState as any);

      handleSaveRedirect("formA", true);

      expect(history.push).not.toHaveBeenCalled();
    });
  });

  // Test shouldRedirect parameter
  it("should not redirect when shouldRedirect is false even if saveStatus is 'succeeded'", () => {
    const mockState = {
      formA: { saveStatus: "succeeded" }
    };
    jest.spyOn(store, "getState").mockReturnValue(mockState as any);

    handleSaveRedirect("formA", false);

    expect(history.push).not.toHaveBeenCalled();
  });

  // Test both conditions must be met
  it("should only redirect when both conditions are met (saveStatus='succeeded' AND shouldRedirect=true)", () => {
    const mockState = {
      ltft: { saveStatus: "succeeded" }
    };
    jest.spyOn(store, "getState").mockReturnValue(mockState as any);

    // Both met
    handleSaveRedirect("ltft", true);
    expect(history.push).toHaveBeenCalledWith("/ltft");

    jest.clearAllMocks();

    // Only one met
    handleSaveRedirect("ltft", false);
    expect(history.push).not.toHaveBeenCalled();

    mockState.ltft.saveStatus = "failed";
    handleSaveRedirect("ltft", true);
    expect(history.push).not.toHaveBeenCalled();
  });
});

describe("chooseRedirectPath", () => {
  const testCases = [
    { formName: "formA", suffix: "", expected: "/formr-a" },
    { formName: "formB", suffix: "", expected: "/formr-b" },
    { formName: "ltft", suffix: "", expected: "/ltft" },
    { formName: "formA", suffix: "/confirm", expected: "/formr-a/confirm" },
    { formName: "formB", suffix: "/create", expected: "/formr-b/create" },
    { formName: "ltft", suffix: "/confirm", expected: "/ltft/confirm" }
  ];

  testCases.forEach(({ formName, suffix, expected }) => {
    it(`should return "${expected}" for form "${formName}" with suffix "${
      suffix || "none"
    }"`, () => {
      const result = chooseRedirectPath(formName as any, suffix as any);
      expect(result).toBe(expected);
    });
  });
});

describe("checkPush", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should dispatch updatedFormsRefreshNeeded when btnLocation is formsList and formName is not ltft", () => {
    const dispatchSpy = jest.spyOn(store, "dispatch");

    checkPush("formA", "formsList");

    expect(dispatchSpy).toHaveBeenCalledWith(updatedFormsRefreshNeeded(true));
  });

  it("should dispatch updatedLtftFormsRefreshNeeded when btnLocation is formsList and formName is ltft", () => {
    const dispatchSpy = jest.spyOn(store, "dispatch");

    checkPush("ltft", "formsList");

    expect(dispatchSpy).toHaveBeenCalledWith(
      updatedLtftFormsRefreshNeeded(true)
    );
  });

  it.each([
    ["formA", "/formr-a"],
    ["formB", "/formr-b"],
    ["ltft", "/ltft"]
  ])(
    "should navigate to '%s' when btnLocation is not formsList and formName is %s",
    (formName, expectedPath) => {
      const btnLocation: BtnLocation = "form";
      checkPush(formName as FormName, btnLocation);
      expect(history.push).toHaveBeenCalledWith(expectedPath);
    }
  );
});
