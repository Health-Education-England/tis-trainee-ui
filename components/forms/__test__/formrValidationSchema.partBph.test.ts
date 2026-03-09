import * as yup from "yup";
import { getFormBValidationSchema } from "../form-builder/form-r/part-b-ph/formBValidationSchema";

describe("formBValidationSchema - identifier and currentRevalDate validation", () => {
  const validBase = {
    forename: "Jane",
    surname: "Smith",
    email: "jane.smith@example.com",
    work: [
      {
        typeOfWork: "Work",
        trainingPost: "Post",
        site: "Site",
        siteLocation: "Location",
        startDate: "2020-01-01",
        endDate: "2020-12-31"
      }
    ],
    sicknessAbsence: 0,
    parentalLeave: 0,
    careerBreaks: 0,
    paidLeave: 0,
    unauthorisedLeave: 0,
    otherLeave: 0,
    totalLeave: 0,
    isHonest: true,
    isHealthy: true,
    isWarned: true,
    isComplying: true,
    havePreviousDeclarations: true,
    havePreviousUnresolvedDeclarations: true,
    previousDeclarations: [
      {
        declarationType: "Type",
        title: "Title",
        locationOfEntry: "Location",
        dateOfEntry: "2019-01-01"
      }
    ],
    previousDeclarationSummary: "Summary",
    haveCurrentDeclarations: true,
    haveCurrentUnresolvedDeclarations: true,
    currentDeclarations: [
      {
        declarationType: "Type",
        title: "Title",
        locationOfEntry: "Location",
        dateOfEntry: "2019-01-01"
      }
    ],
    currentDeclarationSummary: "Summary",
    gmcNumber: "",
    gdcNumber: "",
    publicHealthNumber: "",
    currRevalDate: "2025-01-01",
    prevRevalDate: "",
    dualSpecialty: "",
    prevRevalBody: "",
    prevRevalBodyOther: "Other Body",
    haveCovidDeclarations: true,
    covidDeclarationDto: {
      selfRateForCovid: "Good",
      reasonOfSelfRate: "Reason",
      discussWithSupervisorChecked: true,
      discussWithSomeoneChecked: true,
      otherInformationForPanel: "",
      educationSupervisorEmail: "supervisor@example.com",
      haveChangesToPlacement: true,
      changeCircumstances: "Circumstance",
      changeCircumstanceOther: "Other",
      howPlacementAdjusted: "Adjusted"
    }
  };
  const schema = getFormBValidationSchema(true);

  it("fails if all identifiers are blank", async () => {
    await expect(schema.validate(validBase)).rejects.toThrow(
      /At least one of GMC number, GDC number, or Public Health number must be provided/
    );
  });

  it("passes if only gmcNumber is provided", async () => {
    const data = {
      ...validBase,
      gmcNumber: "123456",
      gdcNumber: "",
      publicHealthNumber: ""
    };
    await expect(schema.validate(data)).resolves.toBeTruthy();
  });

  it("passes if only gdcNumber is provided", async () => {
    const data = {
      ...validBase,
      gmcNumber: "",
      gdcNumber: "654321",
      publicHealthNumber: ""
    };
    await expect(schema.validate(data)).resolves.toBeTruthy();
  });

  it("passes if only publicHealthNumber is provided", async () => {
    const data = {
      ...validBase,
      gmcNumber: "",
      gdcNumber: "",
      publicHealthNumber: "PH123",
      currRevalDate: "" // currRevalDate must be empty for PH non-medical trainees
    };
    await expect(schema.validate(data)).resolves.toBeTruthy();
  });

  it("passes if multiple identifiers are provided", async () => {
    const data = {
      ...validBase,
      gmcNumber: "123",
      gdcNumber: "456",
      publicHealthNumber: "789"
    };
    await expect(schema.validate(data)).resolves.toBeTruthy();
  });

  it("fails if currRevalDate is not a valid date for non-PH", async () => {
    const data = {
      ...validBase,
      gmcNumber: "123456",
      currRevalDate: "not-a-date"
    };
    await expect(schema.validate(data)).rejects.toThrow(
      /Current Revalidation Date must be empty for Public Health non-medical trainees, and is required otherwise/
    );
  });

  it("fails if currRevalDate is outside allowed date range for non-PH", async () => {
    const data = {
      ...validBase,
      gmcNumber: "123456",
      currRevalDate: "1900-01-01"
    };
    await expect(schema.validate(data)).rejects.toThrow(
      /Current Revalidation Date must be empty for Public Health non-medical trainees, and is required otherwise/
    );
  });

  it("passes if currRevalDate is a valid date within allowed range for non-PH", async () => {
    const data = {
      ...validBase,
      gmcNumber: "123456",
      currRevalDate: "2030-01-01"
    };
    await expect(schema.validate(data)).resolves.toBeTruthy();
  });

  it("fails if identifiers are only whitespace", async () => {
    const data = {
      ...validBase,
      gmcNumber: "   ",
      gdcNumber: "   ",
      publicHealthNumber: "   "
    };
    await expect(schema.validate(data)).rejects.toThrow(
      /At least one of GMC number, GDC number, or Public Health number must be provided/
    );
  });

  it("fails if currRevalDate is empty for non-PH", async () => {
    const data = { ...validBase, gmcNumber: "123456", currRevalDate: "" };
    await expect(schema.validate(data)).rejects.toThrow(
      /Current Revalidation Date must be empty for Public Health non-medical trainees, and is required otherwise/
    );
  });

  it("passes if currRevalDate is provided for non-PH", async () => {
    const data = {
      ...validBase,
      gmcNumber: "123456",
      currRevalDate: "2025-01-01"
    };
    await expect(schema.validate(data)).resolves.toBeTruthy();
  });

  it("passes if currRevalDate is empty for PH non-medical", async () => {
    const data = {
      ...validBase,
      gmcNumber: "",
      publicHealthNumber: "PH123",
      currRevalDate: ""
    };
    await expect(schema.validate(data)).resolves.toBeTruthy();
  });

  it("fails if currRevalDate is provided for PH non-medical", async () => {
    const data = {
      ...validBase,
      gmcNumber: "",
      publicHealthNumber: "PH123",
      currRevalDate: "2025-01-01"
    };
    await expect(schema.validate(data)).rejects.toThrow(
      /Current Revalidation Date must be empty for Public Health non-medical trainees, and is required otherwise/
    );
  });
});
