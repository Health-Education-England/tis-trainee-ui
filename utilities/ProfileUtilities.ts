import { FormRPartB, Work } from "../models/FormRPartB";
import { NEW_WORK, MEDICAL_CURRICULUM } from "./Constants";
import { Placement, PlacementGroup } from "../models/Placement";
import { Curriculum, ProgrammeMembership } from "../models/ProgrammeMembership";
import { isCurrentPl, isPastIt, isUpcomingPl, today } from "./DateUtilities";

export type ProfileSType = string | null | undefined;
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
    return programme?.curricula && programme.curricula.length > 0
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

  public static trimmedFutureWork(works: Work[]) {
    const firstFutureWorks = works
      .filter(w => w.startDate > today)
      .sort((a, b) => (a.startDate > b.startDate ? 1 : -1));
    const nextFutureDate = firstFutureWorks[0]
      ? firstFutureWorks[0].startDate
      : today;

    return works.filter(w => w.startDate <= nextFutureDate);
  }

  public static sortedTrimmedWork(work: Work[]) {
    const trimmedWork = this.trimmedFutureWork(work);
    if (trimmedWork.length > 1) {
      return this.sortWorkDesc(trimmedWork);
    } else if (trimmedWork.length === 0) trimmedWork.push(NEW_WORK);

    return trimmedWork;
  }

  public static readonly groupPlacementsByDate = (
    placements: Placement[]
  ): PlacementGroup => {
    const groupedPlacements: PlacementGroup = {
      future: [],
      upcoming: [],
      current: [],
      past: []
    };

    return placements.reduce(
      (grouped: PlacementGroup, placement: Placement) => {
        const { future, upcoming, current, past } = grouped;
        if (isPastIt(placement.endDate)) {
          past.push(placement);
        } else if (isCurrentPl(placement)) {
          current.push(placement);
        } else if (isUpcomingPl(placement)) {
          upcoming.push(placement);
        } else future.push(placement);
        return grouped;
      },
      groupedPlacements
    );
  };
}
