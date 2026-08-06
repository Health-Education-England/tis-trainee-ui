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
  clearHiddenFieldValues,
  getDraftFormId,
  handleSaveRedirect,
  isDateWithin16WeeksOfFirstDate,
  setDraftFormRProps,
  setFormRDataForSubmit,
  showFormField,
  transformReferenceData
} from "../FormBuilderUtilities";
import formAJson from "../../components/forms/form-builder/form-r/part-a/formA.json";
import ltftJson from "../../components/forms/ltft/ltft.json";
import { formANew } from "../../mock-data/draft-formr-parta";
import {
  Field,
  Form,
  FormName
} from "../../components/forms/form-builder/FormBuilder";
import { FormRPartA } from "../../models/FormRPartA";
import { FormRPartB } from "../../models/FormRPartB";
import history from "../../components/navigation/history";
import { updatedFormsRefreshNeeded } from "../../redux/slices/formsSlice";
import { updatedLtftFormsRefreshNeeded } from "../../redux/slices/ltftSummaryListSlice";
import dayjs from "dayjs";

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

describe("Set formData programmeName for submit", () => {
  it("should set programme name before submit", () => {
    const result = setFormRDataForSubmit(
      formAJson as Form,
      formANew as FormRPartA
    );
    expect((result as FormRPartA).programmeName).toEqual(
      formANew.programmeName
    );
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

describe("isDateWithin16WeeksOfFirstDate", () => {
  const referenceDate = new Date("2023-10-01");

  it("should return true when the date is the same as the start date", () => {
    expect(isDateWithin16WeeksOfFirstDate(referenceDate, referenceDate)).toBe(
      true
    );
  });

  it("should return true when the date is 15 weeks after the start date", () => {
    const dateVal = dayjs(referenceDate).add(15, "week").toDate();
    expect(isDateWithin16WeeksOfFirstDate(dateVal, referenceDate)).toBe(true);
  });

  it("should return true when the date is just before 16 weeks after the start date", () => {
    const dateVal = dayjs(referenceDate)
      .add(16, "week")
      .subtract(1, "day")
      .toDate();
    expect(isDateWithin16WeeksOfFirstDate(dateVal, referenceDate)).toBe(true);
  });

  it("should return false when the date is exactly 16 weeks after the start date", () => {
    const dateVal = dayjs(referenceDate).add(16, "week").toDate();
    expect(isDateWithin16WeeksOfFirstDate(dateVal, referenceDate)).toBe(false);
  });

  it("should return false when the date is more than 16 weeks after the start date", () => {
    const dateVal = dayjs(referenceDate).add(16, "week").add(1, "day").toDate();
    expect(isDateWithin16WeeksOfFirstDate(dateVal, referenceDate)).toBe(false);
  });

  it("should default the start date to today if not provided", () => {
    const today = new Date();
    expect(isDateWithin16WeeksOfFirstDate(today)).toBe(true);

    const futureDate = dayjs().add(17, "week").toDate();
    expect(isDateWithin16WeeksOfFirstDate(futureDate)).toBe(false);
  });

  it("should accept string date inputs", () => {
    const refStr = "2023-01-01";
    const validDateStr = "2023-02-01"; // within 16 weeks
    const invalidDateStr = "2023-06-01"; // after 16 weeks (approx 5 months)

    expect(isDateWithin16WeeksOfFirstDate(validDateStr, refStr)).toBe(true);
    expect(isDateWithin16WeeksOfFirstDate(invalidDateStr, refStr)).toBe(false);
  });
});

describe("showFormField", () => {
  const makeField = (overrides: Partial<Field>): Field => ({
    name: "fieldUnderTest",
    type: "text",
    visible: false,
    ...overrides
  });

  it("returns true when field.visible is true regardless of visibleIf", () => {
    const field = makeField({ visible: true });
    expect(showFormField(field, {})).toBe(true);
  });

  it("returns false when not visible and no visibleIf is set", () => {
    expect(showFormField(makeField({}), { anything: "value" })).toBe(false);
  });

  describe("valueInList matcher", () => {
    const field = makeField({
      visibleIf: {
        matcher: "valueInList",
        field: "reasonsSelected",
        values: ["other"]
      }
    });

    it("is visible when scalar parent value is in the values list", () => {
      expect(showFormField(field, { reasonsSelected: "other" })).toBe(true);
    });

    it("is hidden when scalar parent value is not in the values list", () => {
      expect(showFormField(field, { reasonsSelected: "caring" })).toBe(false);
    });

    it("is visible when an array parent value contains a match", () => {
      expect(
        showFormField(field, { reasonsSelected: ["caring", "other"] })
      ).toBe(true);
    });

    it("is hidden when an array parent value contains no match", () => {
      expect(
        showFormField(field, { reasonsSelected: ["caring", "training"] })
      ).toBe(false);
    });

    it("is hidden when values is missing", () => {
      const fieldNoValues = makeField({
        visibleIf: { matcher: "valueInList", field: "reasonsSelected" }
      });
      expect(showFormField(fieldNoValues, { reasonsSelected: "other" })).toBe(
        false
      );
    });
  });

  describe("lessThan16WeeksTest matcher", () => {
    const field = makeField({
      visibleIf: { matcher: "lessThan16WeeksTest", field: "startDate" }
    });

    it("is visible when startDate is within 16 weeks of today", () => {
      const within = dayjs().add(10, "week").format("YYYY-MM-DD");
      expect(showFormField(field, { startDate: within })).toBe(true);
    });

    it("is hidden when startDate is more than 16 weeks away", () => {
      const beyond = dayjs().add(20, "week").format("YYYY-MM-DD");
      expect(showFormField(field, { startDate: beyond })).toBe(false);
    });

    it("is hidden when startDate is empty", () => {
      expect(showFormField(field, { startDate: "" })).toBe(false);
      expect(showFormField(field, { startDate: null })).toBe(false);
      expect(showFormField(field, {})).toBe(false);
    });
  });
});

describe("clearHiddenFieldValues", () => {
  const makeField = (overrides: Partial<Field>): Field => ({
    name: "fieldUnderTest",
    type: "text",
    visible: false,
    ...overrides
  });

  const otherDetailField = makeField({
    name: "reasonsOtherDetail",
    visibleIf: {
      matcher: "valueInList",
      field: "reasonsSelected",
      values: ["other"]
    }
  });

  it("nulls a field that is no longer shown but still holds a value", () => {
    const result = clearHiddenFieldValues([otherDetailField], {
      reasonsSelected: "caring",
      reasonsOtherDetail: "stale detail"
    });
    expect(result.reasonsOtherDetail).toBeNull();
  });

  it("keeps the value of a field that is still shown", () => {
    const formData = {
      reasonsSelected: "other",
      reasonsOtherDetail: "keep me"
    };
    expect(clearHiddenFieldValues([otherDetailField], formData)).toEqual(
      formData
    );
  });

  it("returns the same object reference when nothing needs clearing", () => {
    const formData = { reasonsSelected: "caring", reasonsOtherDetail: null };
    expect(clearHiddenFieldValues([otherDetailField], formData)).toBe(formData);
  });

  describe("LTFT No-path startDate (clear-on-edit)", () => {
    const startDatePage = (ltftJson as Form).pages.find(
      page => page.pageName === "Start date"
    );
    const startDateFields = startDatePage
      ? startDatePage.sections.flatMap(section => section.fields)
      : [];

    it("clears a stamped startDate when a No-path form revisits the Start date page", () => {
      const stamped = dayjs().add(16, "week").format("YYYY-MM-DD");
      const result = clearHiddenFieldValues(startDateFields, {
        canGiveCompliantStartDate: false,
        startDate: stamped,
        exceptionalReasonsDate: dayjs().add(8, "week").format("YYYY-MM-DD")
      });
      expect(result.startDate).toBeNull();
      // the No-path answers the trainee is actually editing are left in place
      expect(result.exceptionalReasonsDate).not.toBeNull();
    });

    it("keeps startDate on the Yes path, where its visibleIf passes", () => {
      const entered = dayjs().add(20, "week").format("YYYY-MM-DD");
      const result = clearHiddenFieldValues(startDateFields, {
        canGiveCompliantStartDate: true,
        startDate: entered
      });
      expect(result.startDate).toBe(entered);
    });
  });
});
