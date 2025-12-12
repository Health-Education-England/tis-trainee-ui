import dayjs from "dayjs";
import {
  mockProgrammeMemberships,
  mockProgrammesForLinkerTest
} from "../../mock-data/trainee-profile";
import {
  filterProgrammesForLinker,
  makeWarningText,
  processLinkedFormData,
  sortProgrammesForLinker
} from "../FormRUtilities";

jest.mock("../../redux/store/store", () => ({
  dispatch: jest.fn()
}));

jest.mock("../../redux/slices/formASlice", () => ({
  updatedCanEdit: jest.fn(),
  loadSavedFormA: jest.fn()
}));

jest.mock("../../redux/slices/formBSlice", () => ({
  updatedCanEditB: jest.fn(),
  loadSavedFormB: jest.fn()
}));

describe("FormRUtilities - filterProgrammesForLinker", () => {
  it("should return 'ARCP' programmes", () => {
    const programmes = mockProgrammesForLinkerTest;
    const filteredProgrammes = filterProgrammesForLinker(programmes, true);
    expect(filteredProgrammes.length).toBe(3);
    expect(filteredProgrammes[0].programmeName).toBe("Acute medicine");
    expect(filteredProgrammes[0].startDate).toBe(dayjs().format("YYYY-MM-DD"));
    expect(filteredProgrammes[0].endDate).toBe(dayjs().format("YYYY-MM-DD"));
    expect(filteredProgrammes[1].programmeName).toBe("Adult psychiatry");
    expect(filteredProgrammes[1].startDate).toBe(
      `${dayjs().subtract(1, "year").year()}-12-31`
    );
    expect(filteredProgrammes[1].endDate).toBe(`${dayjs().year()}-12-31`);
    expect(filteredProgrammes[2].programmeName).toBe("Acute medicine");
    expect(filteredProgrammes[2].startDate).toBe(
      dayjs().subtract(1, "year").format("YYYY-MM-DD")
    );
    expect(filteredProgrammes[2].endDate).toBe(
      dayjs().subtract(1, "year").format("YYYY-MM-DD")
    );
  });

  it("should return 'New Starter' programmes ", () => {
    const programmes = mockProgrammesForLinkerTest;
    const filteredProgrammes = filterProgrammesForLinker(programmes, false);
    expect(filteredProgrammes.length).toBe(3);
    expect(filteredProgrammes[0].programmeName).toBe("Acute medicine");
    expect(filteredProgrammes[0].startDate).toBe(dayjs().format("YYYY-MM-DD"));
    expect(filteredProgrammes[0].endDate).toBe(dayjs().format("YYYY-MM-DD"));
    expect(filteredProgrammes[1].programmeName).toBe("Adult psychiatry");
    expect(filteredProgrammes[1].startDate).toBe(
      `${dayjs().subtract(1, "year").year()}-12-31`
    );
    expect(filteredProgrammes[1].endDate).toBe(`${dayjs().year()}-12-31`);
    expect(filteredProgrammes[2].programmeName).toBe("Adult psychiatry");
    expect(filteredProgrammes[2].startDate).toBe(
      dayjs().add(1, "year").format("YYYY-MM-DD")
    );
    expect(filteredProgrammes[2].endDate).toBe(
      dayjs().add(3, "year").format("YYYY-MM-DD")
    );
  });
});

describe("FormRUtilities - sortedProgrammesForLinker", () => {
  it("should return programmes sorted by name and date", () => {
    const programmes = mockProgrammesForLinkerTest;
    const sortedProgrammes = sortProgrammesForLinker(programmes);
    expect(sortedProgrammes[0]).toEqual({
      ...mockProgrammeMemberships[0],
      programmeName: "Acute medicine",
      startDate: dayjs().add(1, "year").add(1, "day").format("YYYY-MM-DD"),
      endDate: dayjs().add(1, "year").add(1, "day").format("YYYY-MM-DD"),
      tisId: "6"
    });
    expect(sortedProgrammes[3]).toEqual({
      ...mockProgrammeMemberships[0],
      programmeName: "Acute medicine",
      startDate: dayjs().subtract(2, "year").format("YYYY-MM-DD"),
      endDate: dayjs()
        .subtract(1, "year")
        .subtract(1, "day")
        .format("YYYY-MM-DD"),
      tisId: "4"
    });
    expect(sortedProgrammes[sortedProgrammes.length - 1]).toEqual({
      ...mockProgrammeMemberships[0],
      programmeName: "Adult psychiatry",
      startDate: `${dayjs().subtract(1, "year").year()}-12-31`,
      endDate: `${dayjs().year()}-12-31`,
      tisId: "2"
    });
  });
});

describe("FormRUtilities - makeWarningText", () => {
  it("should return 'preSub' warning text", () => {
    const warningText = makeWarningText("preSub", dayjs().toDate());
    expect(warningText).toContain(
      "Please check if this form is correctly linked before submission"
    );
  });
  it("should return 'new' warning text", () => {
    const warningText = makeWarningText("new", dayjs().toDate());
    expect(warningText).toContain("You recently submitted a form on");
  });
  it("should return no warning text if no date given", () => {
    const warningText = makeWarningText("new");
    expect(warningText).toBeNull();
  });
  it("should return no warning text if date is outside the date range", () => {
    const warningText = makeWarningText(
      "new",
      dayjs().subtract(32, "day").toDate()
    );
    expect(warningText).toBeNull();
  });
});

describe("FormRUtilities - processLinkedFormData", () => {
  const testProgrammeMemberships = [
    {
      ...mockProgrammeMemberships[0],
      tisId: "1",
      managingDeanery: "Local Office 1"
    },
    {
      ...mockProgrammeMemberships[1],
      tisId: "2",
      managingDeanery: "Local Office 2"
    }
  ];

  it("should process form data and return expected structure", () => {
    const linkedFormData = {
      isArcp: true,
      programmeMembershipId: "1"
    };

    const result = processLinkedFormData(
      linkedFormData,
      testProgrammeMemberships
    );

    expect(result).toHaveProperty("isArcp");
    expect(result).toHaveProperty("programmeMembershipId");
    expect(result).toHaveProperty("localOfficeName");
    expect(result).toHaveProperty("linkedProgramme");
  });

  it("should find linkedProgramme and localOfficeName when programmeMembershipId matches", () => {
    const linkedFormData = {
      isArcp: true,
      programmeMembershipId: "1"
    };

    const result = processLinkedFormData(
      linkedFormData,
      testProgrammeMemberships
    );
    expect(result.isArcp).toBe(true);
    expect(result.programmeMembershipId).toBe("1");
    expect(result.linkedProgramme?.tisId).toBe("1");
    expect(result.localOfficeName).toBe("Local Office 1");
  });

  it("should not find linkedProgramme and localOfficeName when programmeMembershipId doesn't match", () => {
    const linkedFormData = {
      isArcp: true,
      programmeMembershipId: "999"
    };

    const result = processLinkedFormData(
      linkedFormData,
      testProgrammeMemberships
    );

    expect(result.linkedProgramme).toBeUndefined();
    expect(result.localOfficeName).toBeUndefined();
  });

  it("should not find linkedProgramme when programmeMembershipId is null", () => {
    const linkedFormData = {
      isArcp: null,
      programmeMembershipId: null
    };

    const result = processLinkedFormData(
      linkedFormData,
      testProgrammeMemberships
    );

    expect(result.linkedProgramme).toBeUndefined();
  });
});
