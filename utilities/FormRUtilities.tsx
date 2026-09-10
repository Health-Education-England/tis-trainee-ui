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

export type LinkedFormRDataType = {
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
    traineeProfileData: TraineeProfile
  ) {
    if (pathName === "/formr-a") {
      const formAInitialValues =
        ProfileToFormRPartAInitialValues(traineeProfileData);
      store.dispatch(updatedFormA(formAInitialValues));
    } else if (pathName === "/formr-b") {
      const formBInitialValues =
        ProfileToFormRPartBInitialValues(traineeProfileData);
      store.dispatch(updatedFormB(formBInitialValues));
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

export function filterProgrammesForLinker(
  programmes: ProgrammeMembership[],
  isArcp: boolean
) {
  const now = dayjs().startOf("day");
  const nextYear = dayjs(now).add(1, "year").startOf("day");
  const lastYear = dayjs(now).subtract(1, "year").startOf("day");

  return programmes.filter(programme => {
    if (isFoundationProgramme(programme)) {
      return false;
    }

    const startDate = dayjs(programme.startDate).startOf("day");
    const endDate = dayjs(programme.endDate).startOf("day");
    const currentProgramme = startDate <= now && endDate >= now;
    const programmeStartsInNextYear = startDate <= nextYear && startDate >= now;
    const programmeEndsInLastYear = endDate >= lastYear && endDate <= now;
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
// Note: this keeps the chosen prog id and the other linkage fields together as a  set. If trainee changes mind or prog no longer valid, then the set is cleared.
export function resolveLinkedProgrammeFields(
  programmes: ProgrammeMembership[] | undefined,
  isArcp: boolean,
  programmeMembershipId: string | null | undefined
) {
  const linkedProgramme = filterProgrammesForLinker(
    programmes ?? [],
    isArcp
  ).find(programme => programme.tisId === programmeMembershipId);

  return {
    programmeMembershipId: linkedProgramme?.tisId ?? "",
    programmeName: linkedProgramme?.programmeName ?? "",
    localOfficeName: linkedProgramme?.managingDeanery ?? "",
    programmeSpecialty: linkedProgramme?.programmeName ?? ""
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

type ProcessedFormData = {
  isArcp: boolean | null;
  programmeMembershipId: string | null;
  localOfficeName?: string;
  linkedProgramme?: ProgrammeMembership;
};

export function processLinkedFormData(
  data: LinkedFormRDataType,
  programmeMemberships: ProgrammeMembership[]
): ProcessedFormData {
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
  const FOUNDATION_CURRICULUM_SUBTYPE = "FOUNDATION";
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
