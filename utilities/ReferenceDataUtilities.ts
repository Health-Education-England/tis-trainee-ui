import { Work } from "../models/FormRPartB";
import { KeyValue } from "../models/KeyValue";
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

  public static firstWednesdayInAugust(year: number): Date {
    const firstOfAugust = new Date(year, 7, 1);
    const FIRST_OF_AUG_AS_NUM = 1;
    const firstOfAugustDayOfWeekAsNum = firstOfAugust.getDay();
    const WEDNESDAY_AS_NUM = 3;
    const firstWedInAugust = new Date(
      firstOfAugust.setDate(
        FIRST_OF_AUG_AS_NUM +
          ((WEDNESDAY_AS_NUM - firstOfAugustDayOfWeekAsNum + 7) % 7)
      )
    );
    return firstWedInAugust;
  }

  public static tueBeforeFirstWedNextAugust(currentYear: number) {
    return new Date(
      ReferenceDataUtilities.firstWednesdayInAugust(currentYear + 1).setDate(
        ReferenceDataUtilities.firstWednesdayInAugust(
          currentYear + 1
        ).getDate() - 1
      )
    );
  }

  public static filterArcpWorkPlacements(
    workPlacements: Work[],
    year: number | null
  ): Work[] {
    if (!year) return workPlacements;
    const firstWedInAugust = this.firstWednesdayInAugust(year);
    const tuesBeforeFirstWedInAugustNextYear =
      this.tueBeforeFirstWedNextAugust(year);
    const filteredWorkPlacements: Work[] = workPlacements.filter(
      (placement: Work) => {
        const startDate: Date = new Date(placement.startDate);
        const endDate: Date = new Date(placement.endDate);
        return (
          endDate >= firstWedInAugust &&
          startDate <= tuesBeforeFirstWedInAugustNextYear
        );
      }
    );
    return filteredWorkPlacements;
  }
}
