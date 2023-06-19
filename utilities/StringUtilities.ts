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

  public static argsToString(...args: (string | null)[]) {
    return args.filter((a): a is string => a !== null).join(" ");
  }

  public static validateInteger(val: number | null | undefined) {
    if (val === null || val === undefined) {
      return null;
    } else {
      const strVal = val.toString();
      if (!/^\d+$/.test(strVal)) {
        return "Whole numbers only. No decimals please.";
      }
      return null;
    }
  }
}
