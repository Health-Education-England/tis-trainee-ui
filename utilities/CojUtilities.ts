import day from "dayjs";
import { ProgrammeMembership } from "../models/ProgrammeMembership";
import { COJ_EPOCH, GOLD_GUIDE_VERSION_REGEX } from "./Constants";
import { DateUtilities } from "./DateUtilities";

export class CojUtilities {
  public static getStatusText(startDate: string | null) {
    if (!startDate) {
      return "Unknown status";
    }

    if (new Date(startDate) < COJ_EPOCH) {
      return "Follow Local Office process";
    }

    if (this.canBeSigned(new Date(startDate))) {
      return "Not signed";
    }

    const signableDate = DateUtilities.ToLocalDate(
      this.getSignableFromDate(new Date(startDate))
    );
    return `Not signed, available from ${signableDate}`;
  }

  public static getVersionText(version: string) {
    const regex = new RegExp(GOLD_GUIDE_VERSION_REGEX);
    const matcher = regex.exec(version);
    return matcher ? `Gold Guide ${matcher[1]}` : "Unknown";
  }

  public static canAnyBeSigned(
    programmeMemberships: ProgrammeMembership[]
  ): boolean {
    return programmeMemberships.some(
      pm =>
        !pm.conditionsOfJoining.signedAt &&
        this.canBeSigned(new Date(pm.startDate))
    );
  }

  public static canBeSigned(startDate: Date): boolean {
    const now = new Date();
    const signableFrom = this.getSignableFromDate(startDate);
    return now >= signableFrom && startDate >= COJ_EPOCH;
  }

  private static getSignableFromDate(startDate: Date): Date {
    return day(startDate.getTime()).subtract(13, "week").toDate();
  }
}
