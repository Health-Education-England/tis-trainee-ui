import { ProfileUtilities } from "../ProfileUtilities";
import {
  draftFormRPartB,
  draftFormRPartBWithNoLeaveTotal,
  draftFormRPartBWithNullCareerBreak
} from "../../mock-data/draft-formr-partb";
import {
  mockProgrammeMemberships,
  mockProgrammeMembershipNoCurricula,
  mockProgrammeMembershipNoMedicalCurricula,
  mockProgrammeMembershipDuplicateCurriculaStart
} from "../../mock-data/trainee-profile";

describe("DesignatedBodiesUtilities", () => {
  it("should sort work in desc order by end date", () => {
    const sortedWork = ProfileUtilities.sortWorkDesc(draftFormRPartB.work);
    expect(sortedWork[0].endDate).toBe("2020-12-24");
  });
  it("should return the total leave", () => {
    const totLeave = draftFormRPartB.totalLeave;
    const totalLeaveCalc = ProfileUtilities.getTotal(draftFormRPartB);
    expect(totalLeaveCalc).toEqual(totLeave);
  });
  it("should still return the total leave with null value", () => {
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
    expect(curriculum.curriculumName).toBe("A");
  });
});
