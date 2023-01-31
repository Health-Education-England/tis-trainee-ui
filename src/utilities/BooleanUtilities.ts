export class BooleanUtilities {
  public static ToYesNo(value: any): string {
    let boolValue = value && value != null;

    if (typeof value === "string") {
      boolValue = value?.toLowerCase() === "true";
    }

    return boolValue ? "Yes" : "No";
  }

  public static ToBoolean(value: any): boolean {
    let boolValue = Boolean(value && value != null);

    if (typeof value === "string") {
      boolValue = value?.toLowerCase() === "true";
    }

    return boolValue;
  }
}
