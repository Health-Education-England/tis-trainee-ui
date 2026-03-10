import { FormRPartB, Work } from "../models/FormRPartB";
import { NEW_WORK, MEDICAL_CURRICULUM } from "./Constants";
import { Placement } from "../models/Placement";
import { Curriculum, ProgrammeMembership } from "../models/ProgrammeMembership";
import {
  isCurrentDateBoxed,
  isPastIt,
  isUpcomingDateBoxed,
  today
} from "./DateUtilities";
import {
  ProfileType,
  ProfileDateBoxedGroup,
  TraineeProfile
} from "../models/TraineeProfile";

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
      ? progMems.reduce(
          (a, b) => (a.startDate > b.startDate ? a : b),
          progMems[0]
        )
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

  public static readonly groupDateBoxedByDate = (
    dateBoxed: ProfileType[]
  ): ProfileDateBoxedGroup => {
    const groupedDateBoxed: ProfileDateBoxedGroup = {
      future: [],
      upcoming: [],
      current: [],
      past: []
    };

    return dateBoxed.reduce(
      (grouped: ProfileDateBoxedGroup, dateBoxedItem: ProfileType) => {
        const { future, upcoming, current, past } = grouped;
        if (isPastIt(dateBoxedItem.endDate)) {
          past.push(dateBoxedItem);
        } else if (isCurrentDateBoxed(dateBoxedItem)) {
          current.push(dateBoxedItem);
        } else if (isUpcomingDateBoxed(dateBoxedItem)) {
          upcoming.push(dateBoxedItem);
        } else future.push(dateBoxedItem);
        return grouped;
      },
      groupedDateBoxed
    );
  };
}

export function matchPlacementActionsToProgrammes(
  actions: any[],
  profile: TraineeProfile
): Map<string, string> {
  const { programmeMemberships = [], placements = [] } = profile;

  if (!actions?.length || !programmeMemberships.length || !placements.length) {
    return new Map<string, string>();
  }

  const placementMap = placements.reduce((map, placement) => {
    placement.tisId && map.set(placement.tisId, placement);
    return map;
  }, new Map<string, Placement>());

  const placementActions = actions.filter(
    action =>
      action.tisReferenceInfo?.type === "PLACEMENT" &&
      action.tisReferenceInfo?.id
  );

  return placementActions.reduce((actionMap, action) => {
    const placementId = action.tisReferenceInfo?.id;

    const placement = placementMap.get(placementId);

    if (!placement?.specialty || !placement?.startDate) {
      return actionMap;
    }

    const matchingProgramme = programmeMemberships.find(programme => {
      if (
        !programme?.tisId ||
        !programme?.programmeName ||
        !programme?.startDate
      ) {
        return false;
      }

      try {
        // Calculate the first day of the programme's start month
        const programmeStartDate = new Date(programme.startDate);
        const firstDayOfStartMonth = new Date(
          programmeStartDate.getFullYear(),
          programmeStartDate.getMonth(),
          1
        );

        const programmeEndDate = new Date(programme.endDate);
        const placementStartDate = new Date(placement.startDate);
        const placementSpecialty = placement.specialty.trim().toLowerCase();
        const programmeName = programme.programmeName.trim().toLowerCase();

        return (
          programmeName.startsWith(placementSpecialty) &&
          placementStartDate >= firstDayOfStartMonth &&
          placementStartDate <= programmeEndDate
        );
      } catch (error) {
        console.error(`Error comparing placement to programme:`, error);
        return false;
      }
    });

    matchingProgramme?.tisId &&
      actionMap.set(action.id, matchingProgramme.tisId);

    return actionMap;
  }, new Map<string, string>());
}
