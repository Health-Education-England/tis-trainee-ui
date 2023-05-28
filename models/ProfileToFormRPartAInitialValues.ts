import { FormRPartA } from "./FormRPartA";
import { LifeCycleState } from "./LifeCycleState";
import { TraineeProfile } from "./TraineeProfile";
import { ProfileUtilities } from "../utilities/ProfileUtilities";
import store from "../redux/store/store";

export function ProfileToFormRPartAInitialValues(
  traineeProfileData: TraineeProfile
): FormRPartA {
  const refData = store.getState().reference.combinedRef;
  const isLegitOption = (
    key: string,
    option: string | null | undefined
  ): string => {
    const result =
      refData &&
      refData[key].some(
        (item: { label: string | null | undefined }) => item.label === option
      );
    return result ? option!! : "";
  };

  const pd = traineeProfileData.personalDetails;
  const programme = ProfileUtilities.getRecentProgramme(
    traineeProfileData.programmeMemberships
  );
  const curriculum = ProfileUtilities.getCurriculum(programme);

  return {
    forename: pd?.forenames,
    surname: pd?.surname,
    gmcNumber: pd?.gmcNumber,
    localOfficeName: isLegitOption("localOffice", pd?.personOwner),
    dateOfBirth: pd?.dateOfBirth || null,
    gender: isLegitOption("gender", pd?.gender),
    immigrationStatus: "",
    qualification: pd?.qualification,
    dateAttained: pd?.dateAttained || null,
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
    programmeSpecialty: isLegitOption("curriculum", curriculum?.curriculumName),
    cctSpecialty1: isLegitOption("curriculum", curriculum?.curriculumName),
    cctSpecialty2: "",
    college: "",
    completionDate: programme?.programmeCompletionDate || null,
    trainingGrade: "",
    startDate: programme?.startDate || null,
    programmeMembershipType: programme?.programmeMembershipType,
    wholeTimeEquivalent: "",
    declarationType: "",
    otherImmigrationStatus: "",
    traineeTisId: traineeProfileData.traineeTisId,
    lifecycleState: LifeCycleState.New,
    submissionDate: null,
    lastModifiedDate: null
  };
}
