import {
  ProfileUtilities,
  matchPlacementActionsToProgrammes
} from "../ProfileUtilities";
import {
  isCurrentDateBoxed,
  isFutureDateBoxed,
  isPastIt,
  isUpcomingDateBoxed
} from "../DateUtilities";
import {
  draftFormRPartB,
  draftFormRPartBWithNoLeaveTotal,
  draftFormRPartBWithNullCareerBreak
} from "../../mock-data/draft-formr-partb";
import {
  mockProgrammeMemberships,
  mockProgrammeMembershipsForGrouping,
  mockProgrammeMembershipNoCurricula,
  mockProgrammeMembershipNoMedicalCurricula,
  mockProgrammeMembershipDuplicateCurriculaStart,
  mockPlacements,
  mockPlacementsForGrouping,
  mockProfileDataToTestPlacementActions
} from "../../mock-data/trainee-profile";
import { NEW_WORK } from "../Constants";
import {
  workArr,
  trimmedAndSortedArr,
  workArrWithTwoFutureOnSameDay,
  trimmedAndSortedWorkArrWithTwoFutureOnSameDay
} from "../../mock-data/work-placements-list";
import { Work } from "../../models/FormRPartB";
import { ProgrammeMembership } from "../../models/ProgrammeMembership";
import { Placement } from "../../models/Placement";
import { mockActionsTestData } from "../../mock-data/mock-trainee-actions-data";

describe("ProfileUtilities", () => {
  it("should sort work in desc order by end date", () => {
    const sortedWork = ProfileUtilities.sortWorkDesc(draftFormRPartB.work);
    expect(sortedWork[0].endDate).toBe("2020-12-24");
  });
  it("should return the total leave", () => {
    const totLeave = draftFormRPartB.totalLeave;
    const totalLeaveCalc = ProfileUtilities.getTotal(draftFormRPartB);
    expect(totalLeaveCalc).toEqual(totLeave);
  });
  it("should still return the total leave with zero initial value", () => {
    const totLeave = draftFormRPartBWithNullCareerBreak.totalLeave;
    const totalLeaveCalc = ProfileUtilities.getTotal(
      draftFormRPartBWithNullCareerBreak
    );
    expect(totalLeaveCalc).toEqual(totLeave);
  });
  it("should return the updated form with totalLeave and sorted work", () => {
    const sortedAndTotalledForm = ProfileUtilities.updateVals(
      draftFormRPartBWithNoLeaveTotal
    );
    expect(sortedAndTotalledForm.totalLeave).toEqual(6);
    expect(sortedAndTotalledForm.work[0].endDate).toBe("2020-12-31");
  });
  it("should return Yes if the placement type includes 'in post'", () => {
    expect(ProfileUtilities.getTrainingPostInitVal(mockPlacements[0])).toEqual(
      "Yes"
    );
    expect(ProfileUtilities.getTrainingPostInitVal(mockPlacements[1])).toEqual(
      ""
    );
  });

  it("should return null if no Programme Membership in array", () => {
    const progMem = ProfileUtilities.getRecentProgramme([]);
    expect(progMem).toBe(null);
  });
  it("should return null if Programme Membership is null", () => {
    const progMem = ProfileUtilities.getRecentProgramme(null);
    expect(progMem).toBe(null);
  });
  it("should return the most recent Programme Membership", () => {
    const progMem = ProfileUtilities.getRecentProgramme(
      mockProgrammeMemberships
    );
    expect(progMem).toBe(mockProgrammeMemberships[1]);
  });
  it("should return null when no programme membership", () => {
    const curriculum = ProfileUtilities.getCurriculum(null);
    expect(curriculum).toBe(null);
  });
  it("should return null when programme membership has no curricula", () => {
    const curriculum = ProfileUtilities.getCurriculum(
      mockProgrammeMembershipNoCurricula
    );
    expect(curriculum).toBe(null);
  });
  it("should return undefined when programme membership has no medical curricula", () => {
    const curriculum = ProfileUtilities.getCurriculum(
      mockProgrammeMembershipNoMedicalCurricula
    );
    expect(curriculum).toBe(undefined);
  });
  it("should return the first curriculum name alphabetically when duplicate curriculum start date", () => {
    const curriculum = ProfileUtilities.getCurriculum(
      mockProgrammeMembershipDuplicateCurriculaStart
    );
    if (curriculum) expect(curriculum.curriculumName).toBe("A");
  });

  // Trim future work placements
  it("should return a new blank work placement if empty arr", () => {
    const emptyArr: Work[] = [];
    const trimmedAndSortedEmptyArr =
      ProfileUtilities.sortedTrimmedWork(emptyArr);
    expect(trimmedAndSortedEmptyArr).toEqual([NEW_WORK]);
  });

  it("should return the original array of just one placement", () => {
    const oneItemArr = [workArr[0]];
    const trimmedAndSortedOneItemArr =
      ProfileUtilities.sortedTrimmedWork(oneItemArr);
    expect(trimmedAndSortedOneItemArr).toEqual(oneItemArr);
  });

  it("should trim the future placements by start date to one placement (if no two have same start date) and put all placements in desc order by end date", () => {
    const trimmedAndSorted = ProfileUtilities.sortedTrimmedWork(workArr);
    expect(trimmedAndSorted).toEqual(trimmedAndSortedArr);
  });

  it("should return 2 most recent future placements if they have the same start date and put all placements in desc order by end date", () => {
    const trimmedAndSorted2 = ProfileUtilities.sortedTrimmedWork(
      workArrWithTwoFutureOnSameDay
    );
    expect(trimmedAndSorted2).toEqual(
      trimmedAndSortedWorkArrWithTwoFutureOnSameDay
    );
  });
});

describe("Profile utilities - groupPlacementsByDate", () => {
  it("should classify a placement correctly", () => {
    expect(isPastIt(mockPlacementsForGrouping[0].endDate)).toBe(true);
    expect(isPastIt(mockPlacementsForGrouping[1].endDate)).toBe(false);
    expect(isCurrentDateBoxed(mockPlacementsForGrouping[1])).toBe(true);
    expect(isCurrentDateBoxed(mockPlacementsForGrouping[0])).toBe(false);
    expect(isCurrentDateBoxed(mockPlacementsForGrouping[2])).toBe(false);
    expect(isCurrentDateBoxed(mockPlacementsForGrouping[3])).toBe(false);
    expect(isUpcomingDateBoxed(mockPlacementsForGrouping[2])).toBe(true);
    expect(isUpcomingDateBoxed(mockPlacementsForGrouping[3])).toBe(false);
    expect(isUpcomingDateBoxed(mockPlacementsForGrouping[1])).toBe(false);
    expect(isUpcomingDateBoxed(mockPlacementsForGrouping[0])).toBe(false);
    expect(isFutureDateBoxed(mockPlacementsForGrouping[3])).toBe(true);
    expect(isFutureDateBoxed(mockPlacementsForGrouping[2])).toBe(false);
  });

  it("should group programme memberships correctly", () => {
    expect(
      ProfileUtilities.groupDateBoxedByDate(mockProgrammeMembershipsForGrouping)
    ).toEqual({
      future: [mockProgrammeMembershipsForGrouping[3]],
      upcoming: [mockProgrammeMembershipsForGrouping[2]],
      current: [mockProgrammeMembershipsForGrouping[1]],
      past: [mockProgrammeMembershipsForGrouping[0]]
    });
  });

  describe("Profile utilities - groupProgrammesByDate", () => {
    it("should classify a programme membership correctly", () => {
      expect(isPastIt(mockProgrammeMembershipsForGrouping[0].endDate)).toBe(
        true
      );
      expect(isPastIt(mockProgrammeMembershipsForGrouping[1].endDate)).toBe(
        false
      );
      expect(isCurrentDateBoxed(mockProgrammeMembershipsForGrouping[1])).toBe(
        true
      );
      expect(isCurrentDateBoxed(mockProgrammeMembershipsForGrouping[0])).toBe(
        false
      );
      expect(isCurrentDateBoxed(mockProgrammeMembershipsForGrouping[2])).toBe(
        false
      );
      expect(isCurrentDateBoxed(mockProgrammeMembershipsForGrouping[3])).toBe(
        false
      );
      expect(isUpcomingDateBoxed(mockProgrammeMembershipsForGrouping[2])).toBe(
        true
      );
      expect(isUpcomingDateBoxed(mockProgrammeMembershipsForGrouping[3])).toBe(
        false
      );
      expect(isUpcomingDateBoxed(mockProgrammeMembershipsForGrouping[1])).toBe(
        false
      );
      expect(isUpcomingDateBoxed(mockProgrammeMembershipsForGrouping[0])).toBe(
        false
      );
      expect(isFutureDateBoxed(mockProgrammeMembershipsForGrouping[3])).toBe(
        true
      );
      expect(isFutureDateBoxed(mockProgrammeMembershipsForGrouping[2])).toBe(
        false
      );
    });
  });

  it("should group placements correctly", () => {
    expect(
      ProfileUtilities.groupDateBoxedByDate(mockPlacementsForGrouping)
    ).toEqual({
      future: [mockPlacementsForGrouping[3]],
      upcoming: [mockPlacementsForGrouping[2]],
      current: [mockPlacementsForGrouping[1]],
      past: [mockPlacementsForGrouping[0]]
    });
  });
});

describe("matchPlacementActionsToProgrammes", () => {
  const mockActions = mockActionsTestData;

  it("should match a placement action to a programme when valid", () => {
    const result = matchPlacementActionsToProgrammes(
      mockActions,
      mockProfileDataToTestPlacementActions
    );

    expect(result.size).toBe(1);
    expect(result.has("action-1")).toBe(true);
    expect(result.get("action-1")).toBe("e9401242-a0dd-4a1c-9551-7164e5c776d9");
  });

  it("should not match when placement ID doesn't exist in profile", () => {
    const result = matchPlacementActionsToProgrammes(
      [mockActions[1]],
      mockProfileDataToTestPlacementActions
    );

    expect(result.size).toBe(0);
  });

  it("should not match when reference type is not PLACEMENT", () => {
    const result = matchPlacementActionsToProgrammes(
      [mockActions[2]],
      mockProfileDataToTestPlacementActions
    );

    expect(result.size).toBe(0);
  });

  it("should not match when tisReferenceInfo id is missing", () => {
    const actionWithMissingId = {
      ...mockActions[0],
      id: "action-missing-id",
      tisReferenceInfo: {
        type: "PLACEMENT"
      }
    };

    const result = matchPlacementActionsToProgrammes(
      [actionWithMissingId],
      mockProfileDataToTestPlacementActions
    );

    expect(result.size).toBe(0);
  });

  it("should handle empty arrays gracefully", () => {
    const emptyResult = matchPlacementActionsToProgrammes(
      [],
      mockProfileDataToTestPlacementActions
    );

    expect(emptyResult.size).toBe(0);
  });

  it("should handle empty profile data gracefully", () => {
    const emptyProfileResult = matchPlacementActionsToProgrammes(mockActions, {
      traineeTisId: "test",
      personalDetails: mockProfileDataToTestPlacementActions.personalDetails,
      programmeMemberships: [],
      placements: [],
      qualifications: []
    });

    expect(emptyProfileResult.size).toBe(0);
  });

  it("should match multiple actions to their respective programmes", () => {
    // Create two actions referencing the same placement
    const multipleActions = [
      mockActions[0],
      {
        ...mockActions[0],
        id: "action-5"
      }
    ];

    const result = matchPlacementActionsToProgrammes(
      multipleActions,
      mockProfileDataToTestPlacementActions
    );

    expect(result.size).toBe(2);
    expect(result.has("action-1")).toBe(true);
    expect(result.has("action-5")).toBe(true);
    expect(result.get("action-1")).toBe("e9401242-a0dd-4a1c-9551-7164e5c776d9");
    expect(result.get("action-5")).toBe("e9401242-a0dd-4a1c-9551-7164e5c776d9");
  });

  it("should handle malformed placement data", () => {
    // Create a profile with malformed placement (missing specialty)
    const malformedProfile = {
      ...mockProfileDataToTestPlacementActions,
      placements: [
        {
          ...mockProfileDataToTestPlacementActions.placements[0],
          specialty: null
        } as unknown as Placement
      ]
    };

    const result = matchPlacementActionsToProgrammes(
      [mockActions[0]],
      malformedProfile
    );

    expect(result.size).toBe(0);
  });

  it("should handle malformed programme data", () => {
    // Create a profile with malformed programme (missing name)
    const malformedProfile = {
      ...mockProfileDataToTestPlacementActions,
      programmeMemberships: [
        {
          ...mockProfileDataToTestPlacementActions.programmeMemberships[0],
          programmeName: null // Missing programme name
        } as unknown as ProgrammeMembership
      ]
    };

    const result = matchPlacementActionsToProgrammes(
      [mockActions[0]],
      malformedProfile
    );

    expect(result.size).toBe(0);
  });

  it("should match various programme name formats that start with the specialty", () => {
    const specialty = "general practice";
    const variations = [
      "general practice (London)",
      "general practice/ London",
      "general practice - London",
      "general practice London"
    ];

    variations.forEach(programmeName => {
      // Create a profile with this programme name variation
      const profileWithVariation = {
        ...mockProfileDataToTestPlacementActions,
        placements: [
          {
            ...mockProfileDataToTestPlacementActions.placements[0],
            specialty: specialty
          }
        ],
        programmeMemberships: [
          {
            ...mockProfileDataToTestPlacementActions.programmeMemberships[0],
            programmeName: programmeName
          }
        ]
      };

      const result = matchPlacementActionsToProgrammes(
        [mockActions[0]],
        profileWithVariation
      );
      expect(result.has("action-1")).toBe(true);
      expect(result.get("action-1")).toBe(
        "e9401242-a0dd-4a1c-9551-7164e5c776d9"
      );
    });
  });
});
