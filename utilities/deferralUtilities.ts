import dayjs from "dayjs";
import { DeferralObj } from "../models/DeferralTypes";
import { PersonalDetails } from "../models/PersonalDetails";
import { ProgrammeMembership } from "../models/ProgrammeMembership";

// NOTE: WIP very rough best-guess helpers for the Deferral POC just to get something working.

type MaybeDate = Date | string | null | undefined;

export const DEFERRAL_OVER_12_MONTHS_THRESHOLD = 12;

export const deferralOver12MonthsWarning =
  "A deferral of more than 12 months would normally only be granted in exceptional circumstances and requires Postgraduate Dean approval. Please use the supporting information section to explain your circumstances.";

type DeferralProgrammeDetails = Pick<
  DeferralObj,
  "pmName" | "pmStartDate" | "pmEndDate"
>;

export function getDeferralProgrammeDetails(
  programme?: Pick<
    ProgrammeMembership,
    "programmeName" | "startDate" | "endDate"
  >
): DeferralProgrammeDetails {
  return {
    pmName: programme?.programmeName ?? "",
    pmStartDate: programme?.startDate
      ? dayjs(programme.startDate).format("DD/MM/YYYY")
      : "",
    pmEndDate: programme?.endDate
      ? dayjs(programme.endDate).format("DD/MM/YYYY")
      : ""
  };
}

function parseDeferralDate(value: Exclude<MaybeDate, null | undefined>) {
  if (typeof value === "string") {
    const displayDateMatch = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
    const isoDateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    const dateParts = displayDateMatch
      ? {
          day: displayDateMatch[1],
          month: displayDateMatch[2],
          year: displayDateMatch[3]
        }
      : isoDateMatch
      ? {
          day: isoDateMatch[3],
          month: isoDateMatch[2],
          year: isoDateMatch[1]
        }
      : null;

    if (dateParts) {
      const { day, month, year } = dateParts;
      const parsedDate = dayjs(`${year}-${month}-${day}`).startOf("day");
      return parsedDate.format("YYYY-MM-DD") === `${year}-${month}-${day}`
        ? parsedDate
        : dayjs(Number.NaN);
    }
  }
  return dayjs(value).startOf("day");
}

export function isDeferralOver12Months(
  programmeStartDate: MaybeDate,
  newStartDate: MaybeDate
): boolean {
  if (newStartDate && programmeStartDate) {
    const startDate = parseDeferralDate(programmeStartDate);
    const deferredStartDate = parseDeferralDate(newStartDate);
    return (
      startDate.isValid() &&
      deferredStartDate.isValid() &&
      deferredStartDate.isAfter(
        startDate.add(DEFERRAL_OVER_12_MONTHS_THRESHOLD, "month")
      )
    );
  }
  return false;
}

export function populateDeferralDraftNew(
  personalDetails: PersonalDetails,
  traineeTisId: string
): DeferralObj {
  return {
    traineeTisId,
    pmId: "",
    pmName: "",
    pmStartDate: "",
    pmEndDate: "",
    newStartDate: null,
    reasonSelected: null,
    reasonOtherDetail: null,
    supportingInformation: null,
    declarations: {
      informationIsCorrect: null,
      notGuaranteed: null
    },
    personalDetails: {
      title: personalDetails?.title ?? null,
      surname: personalDetails?.surname ?? null,
      forenames: personalDetails?.forenames ?? null,
      telephoneNumber: personalDetails?.telephoneNumber ?? null,
      mobileNumber: personalDetails?.mobileNumber ?? null,
      email: personalDetails?.email ?? null,
      gmcNumber: personalDetails?.gmcNumber ?? null,
      gdcNumber: personalDetails?.gdcNumber ?? null,
      publicHealthNumber: personalDetails?.publicHealthNumber ?? null
    },
    status: {
      current: {
        state: "DRAFT",
        detail: { reason: "", message: "" },
        modifiedBy: { name: "", email: "", role: "" },
        timestamp: "",
        revision: 0
      },
      history: []
    }
  };
}

// POC: no deferral/qualifying-programmes feature flag yet, so just use current/upcoming programmes for now.
export function makeDeferralProgrammeOptions(
  pmsNotPast: ProgrammeMembership[]
): { value: string; label: string }[] {
  return pmsNotPast.reduce((options, prog) => {
    if (prog.tisId) {
      options.push({
        value: prog.tisId,
        label: `${prog.programmeName} (${dayjs(prog.startDate).format(
          "DD/MM/YYYY"
        )} to ${dayjs(prog.endDate).format("DD/MM/YYYY")})`
      });
    }
    return options;
  }, [] as { value: string; label: string }[]);
}
