import { renderHook } from "@testing-library/react";
import { useFormRViewConfig } from "../useFormRViewConfig";

jest.mock("../../../redux/hooks/hooks", () => ({
  useAppSelector: jest.fn()
}));
jest.mock("../../../redux/slices/referenceSlice", () => ({
  selectAllReference: jest.fn()
}));
jest.mock("../useSelectFormData", () => ({
  useSelectFormData: jest.fn(formName => {
    if (formName === "formB") {
      return { work: [] }; // Provide work array for part-b
    }
    return {}; // Default for part-a
  })
}));

// Explicit mocks for part-b JSONs to ensure predictable structure
jest.mock(
  "../../../components/forms/form-builder/form-r/part-b/formB.json",
  () => ({ name: "formB", pages: [{ pageName: "Personal Details" }] }),
  { virtual: true }
);
jest.mock(
  "../../../components/forms/form-builder/form-r/part-b-ph/formB.json",
  () => ({ name: "formB-ph", pages: [{ pageName: "Personal Details" }] }),
  { virtual: true }
);

const mockReferenceData = {
  dbc: [{ internal: true }, { internal: false }]
};
const phProfile = {
  personalDetails: {
    gmcNumber: "",
    publicHealthNumber: "PH123"
  }
};
const nonPhProfile = {
  personalDetails: {
    gmcNumber: "GMC123",
    publicHealthNumber: ""
  }
};

describe("useFormRViewConfig", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should select part-a view config for non-PH", () => {
    const { useAppSelector } = require("../../../redux/hooks/hooks");
    const {
      selectAllReference
    } = require("../../../redux/slices/referenceSlice");

    useAppSelector.mockImplementation((selectorFn: Function) => {
      if (selectorFn === selectAllReference) return mockReferenceData;
      try {
        return selectorFn({
          formB: { displayCovid: false },
          traineeProfile: { traineeProfileData: nonPhProfile }
        });
      } catch {
        return undefined;
      }
    });

    const { result } = renderHook(() => useFormRViewConfig("A"));
    const expectedFormJson = require("../../../components/forms/form-builder/form-r/part-a/formA.json");
    expect(JSON.parse(JSON.stringify(result.current.formJson))).toEqual(
      JSON.parse(JSON.stringify(expectedFormJson))
    );
    expect(result.current.validationSchemaForView.describe()).toEqual(
      require("../../../components/forms/form-builder/form-r/part-a/formAValidationSchema").formAValidationSchema.describe()
    );
  });

  it("should select part-a-ph view config for PH", () => {
    const { useAppSelector } = require("../../../redux/hooks/hooks");
    const {
      selectAllReference
    } = require("../../../redux/slices/referenceSlice");

    useAppSelector.mockImplementation((selectorFn: Function) => {
      if (selectorFn === selectAllReference) return mockReferenceData;
      try {
        return selectorFn({
          formB: { displayCovid: false },
          traineeProfile: { traineeProfileData: phProfile }
        });
      } catch {
        return undefined;
      }
    });

    const { result } = renderHook(() => useFormRViewConfig("A"));
    const expectedFormJsonPH = require("../../../components/forms/form-builder/form-r/part-a-ph/formA.json");
    expect(JSON.parse(JSON.stringify(result.current.formJson))).toEqual(
      JSON.parse(JSON.stringify(expectedFormJsonPH))
    );
    expect(result.current.validationSchemaForView.describe()).toEqual(
      require("../../../components/forms/form-builder/form-r/part-a-ph/formAValidationSchema").formAValidationSchema.describe()
    );
  });

  it("should select part-b view config for non-PH", () => {
    const { useAppSelector } = require("../../../redux/hooks/hooks");
    const {
      selectAllReference
    } = require("../../../redux/slices/referenceSlice");

    useAppSelector.mockImplementation((selectorFn: Function) => {
      if (selectorFn === selectAllReference) return mockReferenceData;
      // Call the selector with a mock state to identify which slice it's reading
      try {
        const result = selectorFn({
          formB: { displayCovid: false },
          traineeProfile: { traineeProfileData: nonPhProfile }
        });
        return result;
      } catch {
        return undefined;
      }
    });

    const { result } = renderHook(() => useFormRViewConfig("B"));
    const expectedFormJson = require("../../../components/forms/form-builder/form-r/part-b/formB.json");
    expect(JSON.parse(JSON.stringify(result.current.formJson))).toEqual(
      JSON.parse(JSON.stringify(expectedFormJson))
    );
    expect(result.current.validationSchemaForView.describe()).toEqual(
      require("../../../components/forms/form-builder/form-r/part-b/formBValidationSchema")
        .getFormBValidationSchema(false)
        .describe()
    );
  });

  it("should select part-b-ph view config for PH", () => {
    const { useAppSelector } = require("../../../redux/hooks/hooks");
    const {
      selectAllReference
    } = require("../../../redux/slices/referenceSlice");

    useAppSelector.mockImplementation((selectorFn: Function) => {
      if (selectorFn === selectAllReference) return mockReferenceData;
      try {
        const result = selectorFn({
          formB: { displayCovid: false },
          traineeProfile: { traineeProfileData: phProfile }
        });
        return result;
      } catch {
        return undefined;
      }
    });

    const { result } = renderHook(() => useFormRViewConfig("B"));
    const expectedFormJsonPH = require("../../../components/forms/form-builder/form-r/part-b-ph/formB.json");
    expect(JSON.parse(JSON.stringify(result.current.formJson))).toEqual(
      JSON.parse(JSON.stringify(expectedFormJsonPH))
    );
    expect(result.current.validationSchemaForView.describe()).toEqual(
      require("../../../components/forms/form-builder/form-r/part-b-ph/formBValidationSchema")
        .getFormBValidationSchema(false)
        .describe()
    );
  });
});
