import { getFormBValidationSchema } from "../form-builder/form-r/part-b/formBValidationSchema";

describe("formBValidationSchema - work site validation", () => {
  const schema = getFormBValidationSchema(false);

  const workPanel = (trainingPost: string) => ({
    work: [
      {
        typeOfWork: "Gap between posts",
        trainingPost,
        site: "",
        siteLocation: "",
        siteKnownAs: "",
        startDate: "2015-03-16",
        endDate: "2015-08-04"
      }
    ]
  });

  it("requires Site Name and Site Location for a training post", async () => {
    await expect(
      schema.validateAt("work[0].site", workPanel("Yes"))
    ).rejects.toThrow("Site Name is required");
    await expect(
      schema.validateAt("work[0].siteLocation", workPanel("Yes"))
    ).rejects.toThrow("Site Location is required");
  });

  it("allows an empty Site Name and Site Location for a non-training post", async () => {
    await expect(
      schema.validateAt("work[0].site", workPanel("No"))
    ).resolves.toBeUndefined();
    await expect(
      schema.validateAt("work[0].siteLocation", workPanel("No"))
    ).resolves.toBeUndefined();
  });

  it("does not require site details before Training Post has been answered", async () => {
    await expect(
      schema.validateAt("work[0].site", workPanel(""))
    ).resolves.toBeUndefined();
    await expect(
      schema.validateAt("work[0].siteLocation", workPanel(""))
    ).resolves.toBeUndefined();
  });
});

describe("formBValidationSchema - previous revalidation date", () => {
  const schema = getFormBValidationSchema(false);

  it("rejects a two-digit year, which would otherwise read as 19xx", async () => {
    await expect(
      schema.validateAt("prevRevalDate", { prevRevalDate: "0099-01-01" })
    ).rejects.toThrow("The date cannot be before 01/01/1970");
  });
});
