import { ProfileUtilities } from "../ProfileUtilities";
import { submittedFormRPartBs } from "../../mock-data/submitted-formr-partb";
import {
  mockProgrammeMemberships,
  mockProgrammeMembershipNoCurricula,
  mockProgrammeMembershipNoMedicalCurricula,
  mockProgrammeMembershipDuplicateCurriculaStart
} from "../../mock-data/trainee-profile";

describe("DesignatedBodiesUtilities", () => {
  it("should sort work in desc order by end date", () => {
    const sortedWork = ProfileUtilities.sortWorkDesc(submittedFormRPartBs[0]);
    expect(sortedWork[0].endDate).toBe("2020-12-31");
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
