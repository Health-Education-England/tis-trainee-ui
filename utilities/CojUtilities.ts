import { ProgrammeMembership } from "../models/ProgrammeMembership";
import { CojVersionType } from "../redux/slices/userSlice";
import { COJ_EPOCH, GOLD_GUIDE_VERSION_REGEX } from "./Constants";

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
  }

  public static getVersionText(version: CojVersionType) {
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

  public static unsignedCojs(programmeMemberships: ProgrammeMembership[]) {
    return programmeMemberships.filter(
      pm =>
        !pm.conditionsOfJoining.signedAt &&
        this.canBeSigned(new Date(pm.startDate))
    );
  }

  public static canBeSigned(startDate: Date): boolean {
    return startDate >= COJ_EPOCH;
  }
}
