import { Work } from "../models/FormRPartB";
import { KeyValue } from "../models/KeyValue";
import { toISOIgnoreTimezone } from "./FormBuilderUtilities";
export class ReferenceDataUtilities {
  private static getIdFromLabel(refData: KeyValue[], label: string) {
    const myObj: KeyValue | undefined = refData.find(
      (item: KeyValue) => item.label === label
    );

    return myObj?.tisId;
  }

  public static isMatchInReferenceData(
    tisId: string[],
    label: string,
    refData: KeyValue[]
  ) {
    return [...tisId].some(id => this.getIdFromLabel(refData, label) === id);
  }

  public static isMatchedItem(
    refData: KeyValue[],
    formDataProp: string
  ): boolean {
    return refData.some(element => element.label === formDataProp);
  }

  public static checkDataProp(refData: KeyValue[], formDataProp: string) {
    if (!this.isMatchedItem(refData, formDataProp)) {
      return "";
    } else return formDataProp;
  }

  public static thisAugFirstWedAndNextAugTueBeforeFirstWed(fullYear: number): {
    firstWedInAugust: Date;
    tueBeforeFirstWedNextAugust: Date;
  } {
    const firstOfAugust = toISOIgnoreTimezone(new Date(fullYear, 7, 1));
    const firstOfAugustNextYear = toISOIgnoreTimezone(
      new Date(fullYear + 1, 7, 1)
    );
    const FIRST_OF_AUG_AS_NUM = 1;
    const firstOfAugustDayOfWeekAsNum = firstOfAugust.getDay();
    const firstOfAugustNextYearDayOfWeekAsNum = firstOfAugustNextYear.getDay();
    const WEDNESDAY_AS_NUM = 3;
    const firstWedInAugust = new Date(
      firstOfAugust.setDate(
        FIRST_OF_AUG_AS_NUM +
          ((WEDNESDAY_AS_NUM - firstOfAugustDayOfWeekAsNum + 7) % 7)
      )
    );
    const firstWedAugNextYear = new Date(
      firstOfAugustNextYear.setDate(
        FIRST_OF_AUG_AS_NUM +
          ((WEDNESDAY_AS_NUM - firstOfAugustNextYearDayOfWeekAsNum + 7) % 7)
      )
    );

    const tueBeforeFirstWedNextAugust = new Date(
      firstWedAugNextYear.setDate(firstWedAugNextYear.getDate() - 1)
    );

    return {
      firstWedInAugust,
      tueBeforeFirstWedNextAugust
    };
  }

  public static filterArcpWorkPlacements(
    workPlacements: Work[],
    date: Date | null
  ): Work[] {
    if (!date) return workPlacements;
    const { firstWedInAugust, tueBeforeFirstWedNextAugust } =
      this.thisAugFirstWedAndNextAugTueBeforeFirstWed(
        toISOIgnoreTimezone(date).getFullYear()
      );
    const filteredWorkPlacements: Work[] = workPlacements.filter(
      (placement: Work) => {
        const startDate: Date = new Date(placement.startDate);
        const endDate: Date = new Date(placement.endDate);
        return (
          endDate >= firstWedInAugust &&
          startDate <= tueBeforeFirstWedNextAugust
        );
      }
    );
    return filteredWorkPlacements;
  }
}
