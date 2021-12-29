import { TraineeProfile } from "./TraineeProfile";
import { FormRPartA } from "./FormRPartA";
import { LifeCycleState } from "./LifeCycleState";
import { MEDICAL_CURRICULUM } from "../utilities/Constants";

import { useAppSelector } from "../redux/hooks/hooks";
import { selectTraineeProfile } from "../redux/slices/traineeProfileSlice";

const traineeProfileData = useAppSelector(selectTraineeProfile);

export function ProfileToFormRPartAInitialValues(
  traineeProfileData: TraineeProfile | null
): FormRPartA | null {
  if (!traineeProfileData) {
    return null;
  }

  const pd = traineeProfileData.personalDetails;
  const programme =
    traineeProfileData.programmeMemberships.length > 0
      ? traineeProfileData.programmeMemberships.reduce(function (a, b) {
          return a.startDate > b.startDate ? a : b;
        })
      : null;

  const curriculum =
    programme && programme.curricula.length > 0
      ? programme.curricula
          .filter(c => c.curriculumSubType === MEDICAL_CURRICULUM)
          .sort((a, b) => {
            const diff =
              new Date(b.curriculumStartDate).getTime() -
              new Date(a.curriculumStartDate).getTime();

            return diff === 0
              ? a.curriculumName.localeCompare(b.curriculumName)
              : diff;
          })
          .shift()
      : null;

  const model: FormRPartA = {
    forename: pd?.forenames || "",
    surname: pd?.surname || "",
    gmcNumber: pd?.gmcNumber || "",
    localOfficeName: pd?.personOwner || "",
    dateOfBirth: pd?.dateOfBirth || null,
    gender: pd?.gender || "",
    immigrationStatus: "",
    qualification: pd?.qualification || "",
    dateAttained: pd?.dateAttained || null,
    medicalSchool: pd?.medicalSchool || "",
    address1: pd?.address1 || "",
    address2: pd?.address2 || "",
    address3: pd?.address3 || "",
    address4: pd?.address4 || "",
    postCode: pd?.postCode || "",
    telephoneNumber: pd?.telephoneNumber || "",
    mobileNumber: pd?.mobileNumber || "",
    email: "",
    isLeadingToCct: false,
    programmeSpecialty: curriculum?.curriculumName || "",
    cctSpecialty1: curriculum?.curriculumName || "",
    cctSpecialty2: "",
    college: "",
    completionDate: programme?.programmeCompletionDate || null,
    trainingGrade: "",
    startDate: programme?.startDate || null,
    programmeMembershipType: programme?.programmeMembershipType || "",
    wholeTimeEquivalent: undefined,
    declarationType: "",
    otherImmigrationStatus: "",
    traineeTisId: traineeProfileData.traineeTisId,
    lifecycleState: LifeCycleState.New,
    submissionDate: null,
    lastModifiedDate: null
  };
  return model;
}
