import dayjs from "dayjs";
import {
  mockProgrammeMembershipAft,
  mockProgrammeMembershipFoundation,
  mockProgrammeMemberships,
  mockProgrammesForLinkerTest,
  mockProgrammesForLinkerTestWithFoundation
} from "../../mock-data/trainee-profile";
import {
  buildFormRPrefill,
  clearLinkageSection,
  filterProgrammesForLinker,
  hasStaleLinkage,
  isFoundationProgramme,
  makeWarningText,
  processLinkedFormData,
  resolveLinkedProgrammeFields,
  sortProgrammesForLinker
} from "../FormRUtilities";
import {
  ProgrammeMembership,
  programmePanelTemplate
} from "../../models/ProgrammeMembership";
import { LifeCycleState } from "../../models/LifeCycleState";
import store from "../../redux/store/store";

jest.mock("../../redux/store/store", () => ({
  dispatch: jest.fn(),
  getState: jest.fn()
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

  it("should exclude Foundation programmes even when they fall within the current date range", () => {
    const programmes = mockProgrammesForLinkerTestWithFoundation;
    const filteredProgrammes = filterProgrammesForLinker(programmes, false);
    const excludedIds = [
      mockProgrammeMembershipFoundation.tisId,
      mockProgrammeMembershipAft.tisId
    ];
    expect(
      filteredProgrammes.some(programme =>
        excludedIds.includes(programme.tisId)
      )
    ).toBe(false);
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

describe("FormRUtilities - resolveLinkedProgrammeFields", () => {
  const emptySet = {
    programmeMembershipId: "",
    programmeName: "",
    localOfficeName: "",
    programmeSpecialty: ""
  };

  it("should return the linked programme's details when it is valid", () => {
    expect(
      resolveLinkedProgrammeFields(mockProgrammesForLinkerTest, true, "3")
    ).toEqual({
      programmeMembershipId: "3",
      programmeName: "Acute medicine",
      localOfficeName: "East of England",
      programmeSpecialty: "Acute medicine"
    });
  });

  it("should empty set when isArcp choice no longer includes the linked programme", () => {
    expect(
      resolveLinkedProgrammeFields(mockProgrammesForLinkerTest, false, "3")
    ).toEqual(emptySet);
    expect(
      resolveLinkedProgrammeFields(mockProgrammesForLinkerTest, true, "5")
    ).toEqual(emptySet);
  });

  it("should empty the set when the prog is no longer in their profile", () => {
    expect(
      resolveLinkedProgrammeFields(
        mockProgrammesForLinkerTest,
        true,
        "disappearedProgId"
      )
    ).toEqual(emptySet);
  });

  it("should return the empty set if yet to link prog", () => {
    expect(
      resolveLinkedProgrammeFields(mockProgrammesForLinkerTest, true, null)
    ).toEqual(emptySet);
    expect(
      resolveLinkedProgrammeFields(mockProgrammesForLinkerTest, true, "")
    ).toEqual(emptySet);
  });

  it("should return the empty set when no progs in the profile", () => {
    expect(resolveLinkedProgrammeFields(undefined, true, "3")).toEqual(
      emptySet
    );
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

describe("FormRUtilities - clearLinkageSection", () => {
  it("should clear the linkage set and leave everything else alone", () => {
    expect(
      clearLinkageSection({
        forename: "Anthony",
        isArcp: true,
        programmeMembershipId: "4",
        programmeName: "Acute medicine",
        localOfficeName: "East of England",
        programmeSpecialty: "Acute medicine"
      })
    ).toEqual({
      forename: "Anthony",
      isArcp: true,
      programmeMembershipId: "",
      programmeName: "",
      localOfficeName: "",
      programmeSpecialty: ""
    });
  });
});

describe("FormRUtilities - hasStaleLinkage", () => {
  const mockedGetState = store.getState as unknown as jest.Mock;

  beforeEach(() => {
    mockedGetState.mockReturnValue({
      traineeProfile: {
        traineeProfileData: {
          programmeMemberships: mockProgrammesForLinkerTest
        }
      }
    });
  });

  it("should be true for an UNSUBMITTED form whose linked programme is no longer offered", () => {
    expect(hasStaleLinkage(LifeCycleState.Unsubmitted, true, "4")).toEqual(
      true
    );
  });

  it("should be false when the linked programme is still offered", () => {
    expect(hasStaleLinkage(LifeCycleState.Unsubmitted, true, "1")).toEqual(
      false
    );
  });

  it("should be false for any lifecycle state other than UNSUBMITTED", () => {
    expect(hasStaleLinkage(LifeCycleState.Draft, true, "4")).toEqual(false);
    expect(hasStaleLinkage(LifeCycleState.Submitted, true, "4")).toEqual(false);
  });

  it("should be false when there is no linkage to preserve", () => {
    expect(hasStaleLinkage(LifeCycleState.Unsubmitted, true, "")).toEqual(
      false
    );
    expect(hasStaleLinkage(LifeCycleState.Unsubmitted, true, null)).toEqual(
      false
    );
  });

  it("should be false when isArcp has not been answered", () => {
    expect(hasStaleLinkage(LifeCycleState.Unsubmitted, null, "4")).toEqual(
      false
    );
  });
});

describe("FormRUtilities - isFoundationProgramme", () => {
  it("should return false when programme is null", () => {
    const result = isFoundationProgramme(
      null as unknown as ProgrammeMembership
    );
    expect(result).toEqual(false);
  });

  it("should return false when programme.curricula is undefined", () => {
    const programme = {
      ...mockProgrammeMemberships[0],
      curricula: undefined
    } as unknown as ProgrammeMembership;
    const result = isFoundationProgramme(programme);
    expect(result).toEqual(false);
  });

  it("should return true when a curriculum has the foundation specialty", () => {
    const result = isFoundationProgramme(mockProgrammeMembershipFoundation);
    expect(result).toEqual(true);
  });

  it("should return true when a curriculum has the AFT subtype", () => {
    const result = isFoundationProgramme(mockProgrammeMembershipAft);
    expect(result).toEqual(true);
  });

  it("should return false for a non-foundation programme", () => {
    const result = isFoundationProgramme(mockProgrammesForLinkerTest[0]);
    expect(result).toEqual(false);
  });
});

describe("FormRUtilities - buildFormRPrefill", () => {
  const makeProgramme = (
    startDate: string,
    endDate: string,
    overrides: Partial<ProgrammeMembership> = {}
  ): ProgrammeMembership => ({
    ...programmePanelTemplate,
    tisId: "pm1",
    programmeName: "Acute medicine",
    managingDeanery: "North East",
    startDate,
    endDate,
    ...overrides
  });

  const fromNow = (amount: number, unit: "month" | "day") =>
    dayjs().add(amount, unit).format("YYYY-MM-DD");

  const expectPrefilled = (
    programme: ProgrammeMembership,
    isArcp: boolean | null
  ) => {
    expect(buildFormRPrefill([programme], programme.tisId)).toEqual({
      outcome: "prefilled",
      prefill: {
        isArcp,
        programmeMembershipId: "pm1",
        programmeName: "Acute medicine",
        localOfficeName: "North East",
        programmeSpecialty: "Acute medicine"
      }
    });
  };

  const expectUnavailable = (programme: ProgrammeMembership) => {
    expect(buildFormRPrefill([programme], programme.tisId)).toEqual({
      outcome: "unavailable"
    });
  };

  describe("programme not yet started", () => {
    it("pre-fills New Starter when it starts within the next 12 months", () => {
      expectPrefilled(
        makeProgramme(fromNow(6, "month"), fromNow(42, "month")),
        false
      );
    });

    it("pre-fills New Starter on the 12 month boundary", () => {
      expectPrefilled(
        makeProgramme(fromNow(12, "month"), fromNow(48, "month")),
        false
      );
    });

    it("does not pre-fill when it starts more than 12 months away", () => {
      expectUnavailable(
        makeProgramme(fromNow(13, "month"), fromNow(49, "month"))
      );
    });
  });

  describe("programme underway", () => {
    it("pre-fills the programme but no reason", () => {
      expectPrefilled(
        makeProgramme(fromNow(-6, "month"), fromNow(18, "month")),
        null
      );
    });

    it("treats a programme starting today as underway", () => {
      expectPrefilled(
        makeProgramme(fromNow(0, "day"), fromNow(24, "month")),
        null
      );
    });

    it("treats a programme ending today as underway", () => {
      expectPrefilled(
        makeProgramme(fromNow(-24, "month"), fromNow(0, "day")),
        null
      );
    });
  });

  describe("programme ended", () => {
    it("pre-fills ARCP when it ended within the last 12 months", () => {
      expectPrefilled(
        makeProgramme(fromNow(-30, "month"), fromNow(-6, "month")),
        true
      );
    });

    it("pre-fills ARCP on the 12 month boundary", () => {
      expectPrefilled(
        makeProgramme(fromNow(-36, "month"), fromNow(-12, "month")),
        true
      );
    });

    it("does not pre-fill when it ended more than 12 months ago", () => {
      expectUnavailable(
        makeProgramme(fromNow(-37, "month"), fromNow(-13, "month"))
      );
    });
  });

  describe("no prefill possible", () => {
    it("does not pre-fill a foundation programme", () => {
      expectUnavailable(
        makeProgramme(fromNow(-6, "month"), fromNow(18, "month"), {
          curricula: mockProgrammeMembershipFoundation.curricula
        })
      );
    });

    it("does not pre-fill when the programme is not on the profile", () => {
      const programmes = [
        makeProgramme(fromNow(-6, "month"), fromNow(18, "month"))
      ];
      expect(buildFormRPrefill(programmes, "unknown-id")).toEqual({
        outcome: "unavailable"
      });
    });

    it("does not pre-fill when there are no programmes", () => {
      expect(buildFormRPrefill(undefined, "pm1")).toEqual({
        outcome: "unavailable"
      });
    });
  });

  // Note: Of the available programme options on the linkage page, one must equal the pre-fill value otherwise the value will be (silently) cleared by the reconcile effect.
  describe("consistency with the linker filters", () => {
    const linkableCases: [string, string, string, boolean][] = [
      ["not yet started", fromNow(6, "month"), fromNow(42, "month"), false],
      [
        "underway, as New Starter",
        fromNow(-6, "month"),
        fromNow(18, "month"),
        false
      ],
      ["underway, as ARCP", fromNow(-6, "month"), fromNow(18, "month"), true],
      ["ended recently", fromNow(-30, "month"), fromNow(-6, "month"), true]
    ];

    it.each(linkableCases)(
      "%s is linkable",
      (_label, startDate, endDate, isArcp) => {
        const programme = makeProgramme(startDate, endDate);

        expect(buildFormRPrefill([programme], programme.tisId).outcome).toBe(
          "prefilled"
        );
        expect(
          resolveLinkedProgrammeFields([programme], isArcp, programme.tisId)
            .programmeMembershipId
        ).toBe("pm1");
      }
    );
  });
});
