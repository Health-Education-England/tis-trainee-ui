import { FormRPartA } from "./FormRPartA";
import { LifeCycleState } from "./LifeCycleState";
import { MEDICAL_CURRICULUM } from "../utilities/Constants";

export function ProfileToFormRPartAInitialValues(
  traineeProfileData: any
): FormRPartA {
  const pd = traineeProfileData?.personalDetails;
  const programme = traineeProfileData?.programmeMemberships.reduce(function (
    a: { startDate: number },
    b: { startDate: number }
  ) {
    return a.startDate > b.startDate ? a : b;
  });

  const curriculum = programme?.curricula
    .filter(
      (c: { curriculumSubType: string }) =>
        c.curriculumSubType === MEDICAL_CURRICULUM
    )
    .sort(
      (
        a: {
          curriculumStartDate: string | number | Date;
          curriculumName: string;
        },
        b: { curriculumStartDate: string | number | Date; curriculumName: any }
      ) => {
        const diff =
          new Date(b.curriculumStartDate).getTime() -
          new Date(a.curriculumStartDate).getTime();

        return diff === 0
          ? a.curriculumName.localeCompare(b.curriculumName)
          : diff;
      }
    )
    .shift();

  const model: FormRPartA = {
    forename: pd?.forenames,
    surname: pd?.surname,
    gmcNumber: pd?.gmcNumber,
    localOfficeName: pd?.personOwner,
    dateOfBirth: pd?.dateOfBirth,
    gender: pd?.gender,
    immigrationStatus: pd?.immigrationStatus,
    qualification: pd?.qualification,
    dateAttained: pd?.dateAttained,
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
    programmeSpecialty: curriculum?.curriculumName,
    cctSpecialty1: curriculum?.curriculumName,
    cctSpecialty2: "",
    college: "",
    completionDate: programme?.programmeCompletionDate,
    trainingGrade: "",
    startDate: programme?.startDate,
    programmeMembershipType: programme?.programmeMembershipType,
    wholeTimeEquivalent: undefined,
    declarationType: "",
    otherImmigrationStatus: "",
    traineeTisId: traineeProfileData?.traineeTisId,
    lifecycleState: LifeCycleState.New,
    submissionDate: null,
    lastModifiedDate: null
  };
  return model;
}
