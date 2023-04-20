import { COJ_EPOCH, GOLD_GUIDE_VERSION_REGEX } from "./Constants";
import { DateUtilities } from "../utilities/DateUtilities";
import { bool } from "yup";
export function getStatusText(startDate: string | null) {
  if (!startDate) {
    return "Unknown status";
  }
  
  if (new Date(startDate) < COJ_EPOCH) {
    return "Submitted directly to Local Office";
  } else {
    if (DateUtilities.isWithin13Weeks(new Date(startDate))) {
      return "Not signed";
    } else {
      return `Not signed, available from ${DateUtilities.isWithin13Weeks(new Date(startDate),"string")}`;
    }
  }
}

export function getVersionText(version: string) {
  const matcher = GOLD_GUIDE_VERSION_REGEX.exec(version);
  return matcher && matcher[1] ? "Gold Guide " + matcher[1] : "Unknown";
}
