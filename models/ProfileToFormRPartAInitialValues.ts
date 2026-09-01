import { FormRPartA } from "./FormRPartA";
import { LifeCycleState } from "./LifeCycleState";
import { TraineeProfile } from "./TraineeProfile";
import { ProfileUtilities } from "../utilities/ProfileUtilities";
import store from "../redux/store/store";
import { isValidOption } from "../utilities/FormBuilderUtilities";
import { CombinedReferenceData } from "./CombinedReferenceData";

export function ProfileToFormRPartAInitialValues(
  traineeProfileData: TraineeProfile
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
    hasGmcNumber: !!pd?.gmcNumber,
    hasGdcNumber: !!pd?.gdcNumber,
    gmcNumber: pd?.gmcNumber,
    gdcNumber: pd?.gdcNumber,
    publicHealthNumber: pd?.publicHealthNumber,
    // Note: derived from the linked programme once one is selected (TIS21-9015)
    localOfficeName: "",
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
    programmeSpecialty: "",
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
    isArcp: null,
    programmeMembershipId: null
  };
}
