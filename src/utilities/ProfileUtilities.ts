import { FormRPartB, Work } from "../models/FormRPartB";
import { Placement } from "../models/Placement";
import { Curriculum, ProgrammeMembership } from "../models/ProgrammeMembership";
import { MEDICAL_CURRICULUM } from "./Constants";

export class ProfileUtilities {
  public static sortWorkDesc(workArr: Work[]) {
    const workArrForSorting = [...workArr];
    return workArrForSorting.sort(
      (a: Work, b: Work) =>
        new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
    );
  }
  public static getRecentProgramme(
    progMems: ProgrammeMembership[] | null | undefined
  ): ProgrammeMembership | null {
    return progMems && progMems.length > 0
      ? progMems.reduce((a, b) => (a.startDate > b.startDate ? a : b))
      : null;
  }

  public static getCurriculum(
    programme: ProgrammeMembership | null
  ): Curriculum | null | undefined {
    return programme && programme.curricula && programme.curricula.length > 0
      ? programme.curricula
          .filter(
            (c: { curriculumSubType: string }) =>
              c.curriculumSubType === MEDICAL_CURRICULUM
          )
          .sort(
            (
              a: {
                curriculumStartDate: number | Date;
                curriculumName: string;
              },
              b: {
                curriculumStartDate: number | Date;
                curriculumName: string;
              }
            ): number => {
              const diff =
                new Date(b.curriculumStartDate).getTime() -
                new Date(a.curriculumStartDate).getTime();

              return diff === 0
                ? a.curriculumName.localeCompare(b.curriculumName)
                : diff;
            }
          )
          .shift()
      : null;
  }

  private static getNumber(v: number) {
    return isNaN(v) ? 0 : Number(v);
  }

  public static getTotal(vals: FormRPartB) {
    return (
      this.getNumber(vals.sicknessAbsence) +
      this.getNumber(vals.parentalLeave) +
      this.getNumber(vals.careerBreaks) +
      this.getNumber(vals.paidLeave) +
      this.getNumber(vals.unauthorisedLeave) +
      this.getNumber(vals.otherLeave)
    );
  }

  public static updateVals(currVals: FormRPartB) {
    return {
      ...currVals,
      totalLeave: this.getTotal(currVals),
      work: this.sortWorkDesc(currVals.work)
    };
  }

  public static getTrainingPostInitVal(pl: Placement) {
    if (pl.placementType?.toLowerCase().includes("in post")) return "Yes";
    else return "";
  }

  public static getPlacementsExcludingFuturePlacementsAfterNext(pls: Placement[]) {
    const year = "" + new Date().getFullYear();
    const month = ("0" + (new Date().getMonth() + 1)).slice(-2);
    const day = ("0" + new Date().getDate()).slice(-2);
    const today = year + "-" + month + "-" + day;
    const includeAllPlacementsDate = "9999-99-99";

    const firstFuturePlacements = pls
      .filter(placement => placement.startDate.toString() > today)
      .sort((a, b) => a.startDate > b.startDate ? 1 : -1);
    const nextFutureDate = firstFuturePlacements[0]
      ? firstFuturePlacements[0].startDate.toString() : includeAllPlacementsDate;
      
    return pls.filter(placement => placement.startDate.toString() <= nextFutureDate);
  }
}
