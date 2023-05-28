import {
  mockTransformedCombinedReferenceData,
  mockedCombinedReference
} from "../../mock-data/combinedReferenceData";
import { mockForms } from "../../mock-data/formr-list";
import { CombinedReferenceData } from "../../models/CombinedReferenceData";
import { LifeCycleState } from "../../models/LifeCycleState";
import {
  getDraftFormProps,
  showFieldMatchWarning,
  transformReferenceData
} from "../FormBuilderUtilities";

describe("showFieldMatchWarning", () => {
  const inputValue = "Test Value";
  const warningMsg = "Warning message";
  const fieldName = "Test Field";

  it("should return null if inputValue matches the regex pattern", () => {
    const regex = /Test/;
    const result = showFieldMatchWarning(
      inputValue,
      regex,
      warningMsg,
      fieldName
    );
    expect(result).toBeNull();
  });

  it("should return an object with fieldName and warningMsg properties if inputValue does not match the regex pattern", () => {
    const regex = /Not Matched/;
    const result = showFieldMatchWarning(
      inputValue,
      regex,
      warningMsg,
      fieldName
    );
    expect(result).toEqual({ fieldName, warningMsg });
  });
});

describe("transformReferenceData", () => {
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
    expect(getDraftFormProps([])).toBe(null);
  });

  it("should return null if forms list only contains submitted forms", () => {
    expect(getDraftFormProps(mockForms.slice(1, 3))).toBe(null);
  });

  it("should return the unsubmitted form", () => {
    expect(getDraftFormProps(mockForms)).toEqual({
      id: "3",
      lifecycleState: LifeCycleState.Unsubmitted
    });
  });

  it("should return the single draft form", () => {
    expect(getDraftFormProps(mockForms.slice(1, 4))).toEqual({
      id: "4",
      lifecycleState: LifeCycleState.Draft
    });
  });

  it("should return the most recent form between draft and local forms", () => {
    const forms = mockForms.slice(3, 5);
    expect(getDraftFormProps(forms)).toEqual({
      id: "4",
      lifecycleState: LifeCycleState.Draft
    });
  });
});
