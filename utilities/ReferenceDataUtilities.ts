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
}
