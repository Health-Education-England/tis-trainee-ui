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

  public static alphabetSortedArrAsString(
    arr: { value: string; label: string }[]
  ): string {
    const sortedValues = [...arr]
      .map(obj => obj.value)
      .sort((a, b) => a.localeCompare(b));

    return sortedValues.join(", ");
  }

  public static truncateString(str: string, length: number) {
    return str.length > length ? `${str.substring(0, length)}...` : str;
  }

  public static capitalize(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}
