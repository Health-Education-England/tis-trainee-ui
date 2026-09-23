import store from "../redux/store/store";
import { updatedFormA } from "../redux/slices/formASlice";
import { updatedFormB } from "../redux/slices/formBSlice";
import { ProfileToFormRPartAInitialValues } from "../models/ProfileToFormRPartAInitialValues";
import { TraineeProfile } from "../models/TraineeProfile";
import { ProfileToFormRPartBInitialValues } from "../models/ProfileToFormRPartBInitialValues";
import { DateType, DateUtilities, isWithinRange } from "./DateUtilities";
import { Label } from "nhsuk-react-components";
import dayjs from "dayjs";
import { ProgrammeMembership } from "../models/ProgrammeMembership";
import { LifeCycleState } from "../models/LifeCycleState";
import type { FormData } from "../components/forms/form-builder/FormBuilder";

type LinkedFormRDataType = {
  isArcp: null | boolean;
  programmeMembershipId: null | string;
  linkedProgramme?: ProgrammeMembership;
  localOfficeName?: string;
};

export class FormRUtilities {
  public static showMsgIfEmpty(
    value: string,
    message: string = "None recorded"
  ) {
    return value.length > 0 ? value : message;
  }

  public static displaySubmissionDate(date: DateType, cyTag: string) {
    return (
      <Label data-cy={cyTag}>
        Form submitted on: {DateUtilities.ConvertToLondonTime(date)}
      </Label>
    );
  }

  public static loadNewForm(
    pathName: string,
    traineeProfileData: TraineeProfile,
    prefill?: FormRPrefill
  ) {
    if (pathName === "/formr-a") {
      const formAInitialValues =
        ProfileToFormRPartAInitialValues(traineeProfileData);
      store.dispatch(updatedFormA({ ...formAInitialValues, ...prefill }));
    } else if (pathName === "/formr-b") {
      const formBInitialValues =
        ProfileToFormRPartBInitialValues(traineeProfileData);
      store.dispatch(updatedFormB({ ...formBInitialValues, ...prefill }));
    }
  }
}

// form r linker utils

export type FormStatusType = "new" | "preSub";

export function makeWarningText(
  formStatus: FormStatusType,
  latestSubDate?: DateType
) {
  if (formStatus === "preSub") {
    return "Please check if this form is correctly linked before submission, and please think carefully before submitting as the current process for deleting or re-submitting a form isn't straightforward.";
  }
  if (formStatus === "new" && isWithinRange(latestSubDate, 31, "d")) {
    return `You recently submitted a form on ${dayjs(latestSubDate).format(
      "DD/MM/YYYY"
    )}. Are you sure you want to submit another?`;
  }
  return null;
}

function getLinkerWindows(programme: ProgrammeMembership) {
  const now = dayjs().startOf("day");
  const nextYear = dayjs(now).add(1, "year").startOf("day");
  const lastYear = dayjs(now).subtract(1, "year").startOf("day");

  const startDate = dayjs(programme.startDate).startOf("day");
  const endDate = dayjs(programme.endDate).startOf("day");

  return {
    currentProgramme: startDate <= now && endDate >= now,
    programmeStartsInNextYear: startDate <= nextYear && startDate >= now,
    programmeEndsInLastYear: endDate >= lastYear && endDate <= now
  };
}

export function filterProgrammesForLinker(
  programmes: ProgrammeMembership[],
  isArcp: boolean
) {
  return programmes.filter(programme => {
    if (isFoundationProgramme(programme)) {
      return false;
    }

    const {
      currentProgramme,
      programmeStartsInNextYear,
      programmeEndsInLastYear
    } = getLinkerWindows(programme);

    return (
      currentProgramme ||
      (isArcp ? programmeEndsInLastYear : programmeStartsInNextYear)
    );
  });
}

const selectLinkedProgrammeOptionsSorter = (
  a: ProgrammeMembership,
  b: ProgrammeMembership
) => {
  if (a.programmeName < b.programmeName) return -1;
  if (a.programmeName > b.programmeName) return 1;
  const aDate = new Date(a.startDate).getTime();
  const bDate = new Date(b.startDate).getTime();
  return bDate - aDate;
};

export const sortProgrammesForLinker = (programmes: ProgrammeMembership[]) => {
  return programmes.sort(selectLinkedProgrammeOptionsSorter);
};

export const filterManagingDeanery = (
  programmeMemberships: ProgrammeMembership[],
  PmId: string
): string | undefined =>
  programmeMemberships?.filter(prog => prog.tisId === PmId)[0]?.managingDeanery;

export function getLinkedProgrammeDetails(
  programMemberships: ProgrammeMembership[] | undefined,
  programMembershipId: string | null | undefined
): ProgrammeMembership | undefined {
  if (!programMembershipId || !programMemberships) return;
  return programMemberships.find(prog => prog.tisId === programMembershipId);
}

const toLinkageFields = (programme: ProgrammeMembership | undefined) => ({
  programmeMembershipId: programme?.tisId ?? "",
  programmeName: programme?.programmeName ?? "",
  localOfficeName: programme?.managingDeanery ?? "",
  programmeSpecialty: programme?.programmeName ?? ""
});

// Note: this keeps the chosen prog id and the other linkage fields together as a  set. If trainee changes mind or prog no longer valid, then the set is cleared.
export function resolveLinkedProgrammeFields(
  programmes: ProgrammeMembership[] | undefined,
  isArcp: boolean,
  programmeMembershipId: string | null | undefined
) {
  return toLinkageFields(
    filterProgrammesForLinker(programmes ?? [], isArcp).find(
      programme => programme.tisId === programmeMembershipId
    )
  );
}

export type FormRPrefill = {
  isArcp: boolean | null;
} & ReturnType<typeof toLinkageFields>;

export type FormRPrefillResult =
  | { outcome: "prefilled"; prefill: FormRPrefill }
  | { outcome: "unavailable" };

export function buildFormRPrefill(
  programmes: ProgrammeMembership[] | undefined,
  programmeMembershipId: string | null | undefined
): FormRPrefillResult {
  const programme = programmeMembershipId
    ? programmes?.find(prog => prog.tisId === programmeMembershipId)
    : undefined;
  if (!programme || isFoundationProgramme(programme)) {
    return { outcome: "unavailable" };
  }

  const {
    currentProgramme,
    programmeStartsInNextYear,
    programmeEndsInLastYear
  } = getLinkerWindows(programme);

  let isArcp: boolean | null;
  if (currentProgramme) {
    isArcp = null;
  } else if (programmeStartsInNextYear) {
    isArcp = false;
  } else if (programmeEndsInLastYear) {
    isArcp = true;
  } else {
    return { outcome: "unavailable" };
  }

  return {
    outcome: "prefilled",
    prefill: { isArcp, ...toLinkageFields(programme) }
  };
}

export const clearLinkageSection = (formData: FormData): FormData => ({
  ...formData,
  programmeMembershipId: "",
  programmeName: "",
  localOfficeName: "",
  programmeSpecialty: ""
});

export function hasStaleLinkage(
  lifecycleState: LifeCycleState | undefined,
  isArcp: boolean | null | undefined,
  programmeMembershipId: string | null | undefined
): boolean {
  if (lifecycleState !== LifeCycleState.Unsubmitted) return false;
  if (!programmeMembershipId || typeof isArcp !== "boolean") return false;

  const { programmeMemberships } =
    store.getState().traineeProfile.traineeProfileData;

  return !filterProgrammesForLinker(programmeMemberships ?? [], isArcp).some(
    programme => programme.tisId === programmeMembershipId
  );
}

export function processLinkedFormData(
  data: LinkedFormRDataType,
  programmeMemberships: ProgrammeMembership[]
): LinkedFormRDataType {
  const { isArcp, programmeMembershipId } = data;

  const localOfficeName = filterManagingDeanery(
    programmeMemberships,
    programmeMembershipId as string
  );

  const linkedProgramme = getLinkedProgrammeDetails(
    programmeMemberships,
    programmeMembershipId
  );

  return {
    isArcp,
    programmeMembershipId,
    localOfficeName,
    linkedProgramme
  };
}

export function isFoundationProgramme(programme: ProgrammeMembership): boolean {
  const FOUNDATION_CURRICULUM_SUBTYPE = "AFT";
  const FOUNDATION_SPECIALTY = "Foundation";

  if (!programme?.curricula) {
    return false;
  }

  return programme.curricula.some(curriculum => {
    const specialty = curriculum.curriculumSpecialty;
    const subtype = curriculum.curriculumSubType;

    return (
      subtype?.toUpperCase() === FOUNDATION_CURRICULUM_SUBTYPE.toUpperCase() ||
      specialty?.toUpperCase() === FOUNDATION_SPECIALTY.toUpperCase()
    );
  });
}
