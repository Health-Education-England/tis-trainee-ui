import day from "dayjs";
import { COJ_EPOCH, GOLD_GUIDE_VERSION_REGEX } from "./Constants";
import { DateUtilities } from "./DateUtilities";

export class CojUtilities {
  public static getStatusText(startDate: string | null) {
    if (!startDate) {
      return "Unknown status";
    }

    if (new Date(startDate) < COJ_EPOCH) {
      return "Submitted directly to Local Office";
    }

    if (CojUtilities.canBeSigned(new Date(startDate))) {
      return "Not signed";
    }

    const signableDate = DateUtilities.ToLocalDate(
      CojUtilities.getSignableFromDate(new Date(startDate))
    );
    return `Not signed, available from ${signableDate}`;
  }

  public static getVersionText(version: string) {
    const matcher = GOLD_GUIDE_VERSION_REGEX.exec(version);
    return matcher && matcher[1] ? `Gold Guide ${matcher[1]}` : "Unknown";
  }

  public static canBeSigned(startDate: Date): boolean {
    const now = new Date();
    const signableFrom = CojUtilities.getSignableFromDate(startDate);
    return now >= signableFrom && startDate >= COJ_EPOCH;
  }

  private static getSignableFromDate(startDate: Date): Date {
    return day(startDate.getTime()).subtract(13, "week").toDate();
  }
}
