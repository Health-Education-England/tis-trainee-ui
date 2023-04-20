import { COJ_EPOCH, GOLD_GUIDE_VERSION_REGEX } from "./Constants";

const SIGNABLE_OFFSET = 13 * 7 * 24 * 60 * 60 * 1000; // 13 weeks.

export function getStatusText(startDate: string | null) {
  if (!startDate) {
    return "Unknown status";
  }

  if (new Date(startDate) < COJ_EPOCH) {
    return "Submitted directly to Local Office";
  } else {
    if (canBeSigned(new Date(startDate))) {
      return "Not signed";
    } else {
      return `Not signed, available from ${getSignableFromDate(
        new Date(startDate)
      ).toLocaleDateString()}`;
    }
  }
}

export function getVersionText(version: string) {
  const matcher = GOLD_GUIDE_VERSION_REGEX.exec(version);
  return matcher && matcher[1] ? "Gold Guide " + matcher[1] : "Unknown";
}

function canBeSigned(startDate: Date): boolean {
  const now = new Date();
  const signableFrom = getSignableFromDate(startDate);
  return now >= signableFrom;
}

function getSignableFromDate(startDate: Date): Date {
  return new Date(startDate.getTime() - SIGNABLE_OFFSET);
}
