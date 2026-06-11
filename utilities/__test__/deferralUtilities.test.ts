import {
  getDeferralProgrammeDetails,
  isDeferralOver12Months
} from "../deferralUtilities";

describe("getDeferralProgrammeDetails", () => {
  it("maps programme metadata to display-ready form fields", () => {
    expect(
      getDeferralProgrammeDetails({
        programmeName: "Cardiology",
        startDate: "2026-08-01",
        endDate: "2032-07-31"
      })
    ).toEqual({
      pmName: "Cardiology",
      pmStartDate: "01/08/2026",
      pmEndDate: "31/07/2032"
    });
  });

  it("returns empty fields when no programme is selected", () => {
    expect(getDeferralProgrammeDetails()).toEqual({
      pmName: "",
      pmStartDate: "",
      pmEndDate: ""
    });
  });
});

describe("isDeferralOver12Months", () => {
  it("returns false when the new start date is exactly 12 months later", () => {
    expect(isDeferralOver12Months("2026-08-01", "2027-08-01")).toBe(false);
  });

  it("returns true when the new start date is more than 12 months later", () => {
    expect(isDeferralOver12Months("2026-08-01", "2027-08-02")).toBe(true);
  });

  it("supports programme dates formatted for display", () => {
    expect(isDeferralOver12Months("01/08/2026", "2027-08-02")).toBe(true);
  });

  it("handles leap-year boundaries by calendar month", () => {
    expect(isDeferralOver12Months("2024-02-29", "2025-02-28")).toBe(false);
    expect(isDeferralOver12Months("2024-02-29", "2025-03-01")).toBe(true);
  });

  it("returns false when either date is missing or invalid", () => {
    expect(isDeferralOver12Months(null, "2027-08-02")).toBe(false);
    expect(isDeferralOver12Months("2026-08-01", null)).toBe(false);
    expect(isDeferralOver12Months("invalid", "2027-08-02")).toBe(false);
    expect(isDeferralOver12Months("31/02/2026", "2027-08-02")).toBe(false);
  });
});
