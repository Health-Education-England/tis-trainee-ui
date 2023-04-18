import { COJ_EPOCH, GOLD_GUIDE_VERSION_REGEX } from "./Constants";

export function getStatusText(startDate: string | null) {
  if (!startDate) {
    return "Unknown status";
  }

  return new Date(startDate) < COJ_EPOCH
    ? "Submitted directly to Local Office"
    : "Not signed";
}

export function getVersionText(version: string) {
  const matcher = GOLD_GUIDE_VERSION_REGEX.exec(version);
  return matcher && matcher[1] ? "Gold Guide " + matcher[1] : "Unknown";
}
