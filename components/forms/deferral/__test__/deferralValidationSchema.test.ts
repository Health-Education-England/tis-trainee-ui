import {
  deferralReasonError,
  deferralValidationSchema,
  supportingInformationOver12MonthsError
} from "../deferralValidationSchema";

describe("deferral reason validation", () => {
  const validateReason = (reasonSelected: unknown) =>
    deferralValidationSchema.validateAt("reasonSelected", {
      reasonSelected
    });

  it("accepts a single selected reason", async () => {
    await expect(validateReason("Ill health")).resolves.toBe("Ill health");
  });

  it("requires a selected reason", async () => {
    await expect(validateReason(null)).rejects.toThrow(deferralReasonError);
  });

  it("rejects multiple selected reasons", async () => {
    await expect(
      validateReason(["Maternity leave", "Ill health"])
    ).rejects.toThrow();
  });
});

describe("deferral supporting information validation", () => {
  const validateSupportingInformation = (
    supportingInformation: unknown,
    newStartDate: string,
    pmStartDate = "01/08/2026"
  ) =>
    deferralValidationSchema.validateAt("supportingInformation", {
      supportingInformation,
      pmStartDate,
      newStartDate
    });

  it("is optional for a deferral of 12 months or less", async () => {
    await expect(
      validateSupportingInformation(null, "2027-08-01")
    ).resolves.toBeNull();
  });

  it("is required for a deferral of more than 12 months", async () => {
    await expect(
      validateSupportingInformation(null, "2027-08-02")
    ).rejects.toThrow(supportingInformationOver12MonthsError);
  });

  it("rejects blank supporting information for a deferral of more than 12 months", async () => {
    await expect(
      validateSupportingInformation("   ", "2027-08-02")
    ).rejects.toThrow(supportingInformationOver12MonthsError);
  });

  it("accepts supporting information for a deferral of more than 12 months", async () => {
    await expect(
      validateSupportingInformation(
        "My circumstances require extra time.",
        "2027-08-02"
      )
    ).resolves.toBe("My circumstances require extra time.");
  });
});

describe("deferral personal details validation", () => {
  const validPersonalDetails = {
    forenames: "Jo",
    surname: "Surname",
    gmcNumber: "1234567",
    telephoneNumber: "01234567890",
    mobileNumber: "07123456789",
    email: "jo@example.com",
    gdcNumber: null,
    publicHealthNumber: null
  };

  it("accepts valid personal and contact details", async () => {
    await expect(
      deferralValidationSchema.validateAt("personalDetails", {
        personalDetails: validPersonalDetails
      })
    ).resolves.toMatchObject(validPersonalDetails);
  });

  it("requires the applicant's forename", async () => {
    await expect(
      deferralValidationSchema.validateAt("personalDetails", {
        personalDetails: { ...validPersonalDetails, forenames: null }
      })
    ).rejects.toThrow("Forename is required");
  });

  it("validates the applicant's email address", async () => {
    await expect(
      deferralValidationSchema.validateAt("personalDetails", {
        personalDetails: { ...validPersonalDetails, email: "not-an-email" }
      })
    ).rejects.toThrow("Email address is invalid");
  });
});
