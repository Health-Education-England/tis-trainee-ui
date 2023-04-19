import { COJ_EPOCH, GOLD_GUIDE_VERSION_REGEX } from "./Constants";
import { DateUtilities } from "../utilities/DateUtilities";
export function getStatusText(startDate: string | null) {
  if (!startDate) {
    return "Unknown status";
  }
  
  return new Date(startDate) < COJ_EPOCH
    ? "Submitted directly to Local Office"
    : DateUtilities.isWithin13Weeks(new Date(startDate)) ? "Not signed"
    : "CoJ can only be signed within 13 weeks of the start date";
}

export function getVersionText(version: string) {
  const matcher = GOLD_GUIDE_VERSION_REGEX.exec(version);
  return matcher && matcher[1] ? "Gold Guide " + matcher[1] : "Unknown";
}
