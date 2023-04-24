import { COJ_EPOCH, GOLD_GUIDE_VERSION_REGEX } from "./Constants";

export const SIGNABLE_OFFSET = 13 * 7 * 24 * 60 * 60 * 1000; // 13 weeks.

export function getStatusText(startDate: string | null) {
  if (!startDate) {
    return "Unknown status";
  }

  const startDateAsDate = new Date(startDate);
  if (startDateAsDate < COJ_EPOCH) {
    return "Submitted directly to Local Office";
  }

  if (canBeSigned(startDateAsDate, new Date())) {
    return "Not signed";
  }
    
  return `Not signed, available from ${getSignableFromDate(
      startDateAsDate
    ).toLocaleDateString()}`;
}

export function getVersionText(version: string) {
  const matcher = version.match(GOLD_GUIDE_VERSION_REGEX);
  return matcher ? `Gold Guide ${matcher[1]}` : "Unknown";
}

export function canBeSigned(startDate: Date, now: Date): boolean {
  if (startDate < COJ_EPOCH) {
    return false;
  }
  const signableFrom = getSignableFromDate(startDate);
  return now >= signableFrom;
}

function getSignableFromDate(startDate: Date): Date {
  return new Date(startDate.getTime() - SIGNABLE_OFFSET);
}
