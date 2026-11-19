import { formAValidationSchema } from "../form-builder/form-r/part-a/formAValidationSchema";
import { validateFields } from "../../../utilities/FormBuilderUtilities";

describe("formAValidationSchema - two-digit years", () => {
  it("rejects a Date of Birth with a two-digit year, which would otherwise read as 19xx", async () => {
    await expect(
      formAValidationSchema.validateAt("dateOfBirth", {
        dateOfBirth: "0099-01-01"
      })
    ).rejects.toThrow("Date of Birth is before the minimum date allowed");
  });

  it("rejects a Date Awarded with a two-digit year, which would otherwise read as 19xx", async () => {
    await expect(
      formAValidationSchema.validateAt("dateAttained", {
        dateAttained: "0099-01-01"
      })
    ).rejects.toThrow("Date awarded is before the minimum date allowed");
  });

  it("rejects a two-digit year through the form builder's page validation", async () => {
    await expect(
      validateFields(
        [
          { name: "dateOfBirth", type: "date", visible: true },
          { name: "dateAttained", type: "date", visible: true }
        ],
        { dateOfBirth: "0099-01-01", dateAttained: "0099-01-01" },
        formAValidationSchema
      )
    ).rejects.toMatchObject({
      errors: expect.arrayContaining([
        "Date of Birth is before the minimum date allowed",
        "Date awarded is before the minimum date allowed"
      ])
    });
  });

  it("still accepts the same dates with a four-digit year", async () => {
    await expect(
      formAValidationSchema.validateAt("dateOfBirth", {
        dateOfBirth: "1999-01-01"
      })
    ).resolves.toBeDefined();
    await expect(
      formAValidationSchema.validateAt("dateAttained", {
        dateAttained: "1999-01-01"
      })
    ).resolves.toBeDefined();
  });

  it("keeps the Programme start date's message for a two-digit year", async () => {
    await expect(
      formAValidationSchema.validateAt("startDate", {
        startDate: "0099-01-01"
      })
    ).rejects.toThrow("This date is outside the allowed date range");
  });
});
