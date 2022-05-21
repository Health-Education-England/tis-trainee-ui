import { VALUE_NOT_GIVEN } from "./Constants";

export class StringUtilities {
  public static TrimZeros(str: string) {
    if (str) {
      const numStr = Number(str).toString();
      if (numStr !== "0") {
        return numStr;
      }
    }
    return VALUE_NOT_GIVEN;
  }

  public static argsToString(...args: string[]) {
    return args.filter(a => a !== null).join(" ");
  }

  public static validateInteger(val: number) {
    const strVal: string = val.toString();
    if (!/^\d+$/.test(strVal)) {
      return "Whole numbers only. No decimals please";
    }
  }
}
