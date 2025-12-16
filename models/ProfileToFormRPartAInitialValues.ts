import { FormRPartA } from "./FormRPartA";
import { LifeCycleState } from "./LifeCycleState";
import { TraineeProfile } from "./TraineeProfile";
import { ProfileUtilities } from "../utilities/ProfileUtilities";
import store from "../redux/store/store";
import { isValidOption } from "../utilities/FormBuilderUtilities";
import { CombinedReferenceData } from "./CombinedReferenceData";
import { LinkedFormRDataType } from "../components/forms/form-linker/FormLinkerForm";

export function ProfileToFormRPartAInitialValues(
  traineeProfileData: TraineeProfile,
  linkedFormRData?: LinkedFormRDataType
): FormRPartA {
  const refData: CombinedReferenceData = store.getState().reference.combinedRef;
  const pd = traineeProfileData.personalDetails;

  const programme = ProfileUtilities.getRecentProgramme(
    traineeProfileData.programmeMemberships
  );
  const curriculum = ProfileUtilities.getCurriculum(programme);

  return {
    forename: pd?.forenames,
    surname: pd?.surname,
    gmcNumber: pd?.gmcNumber,
    localOfficeName: linkedFormRData?.localOfficeName,
    dateOfBirth: pd?.dateOfBirth ?? null,
    gender: isValidOption("gender", pd?.gender, refData),
    immigrationStatus: "",
    qualification: pd?.qualification,
    dateAttained: pd?.dateAttained ?? null,
    medicalSchool: pd?.medicalSchool,
    address1: pd?.address1,
    address2: pd?.address2,
    address3: pd?.address3,
    address4: pd?.address4,
    postCode: pd?.postCode,
    telephoneNumber: pd?.telephoneNumber,
    mobileNumber: pd?.mobileNumber,
    email: "",
    isLeadingToCct: false,
    programmeSpecialty: linkedFormRData?.linkedProgramme?.programmeName,
    cctSpecialty1: isValidOption("curriculum", curriculum?.curriculumName),
    cctSpecialty2: "",
    college: "",
    completionDate: programme?.programmeCompletionDate ?? null,
    trainingGrade: "",
    startDate: programme?.startDate ?? null,
    programmeMembershipType: "Substantive",
    wholeTimeEquivalent: "",
    declarationType: "",
    otherImmigrationStatus: "",
    traineeTisId: traineeProfileData.traineeTisId,
    lifecycleState: LifeCycleState.Draft,
    submissionDate: null,
    lastModifiedDate: null,
    isArcp: linkedFormRData?.isArcp,
    programmeMembershipId: linkedFormRData?.programmeMembershipId
  };
}
