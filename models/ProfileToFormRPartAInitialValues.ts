import { FormRPartA } from "./FormRPartA";
import { LifeCycleState } from "./LifeCycleState";
import { TraineeProfile } from "./TraineeProfile";
import { ProfileUtilities } from "../utilities/ProfileUtilities";
import store from "../redux/store/store";
import { filterCurriculumOptions } from "../utilities/FormBuilderUtilities";
import { CombinedReferenceData } from "./CombinedReferenceData";

export function ProfileToFormRPartAInitialValues(
  traineeProfileData: TraineeProfile
): FormRPartA {
  const refData: CombinedReferenceData = store.getState().reference.combinedRef;
  const filteredCurriculumData: { value: string; label: string }[] | undefined =
    filterCurriculumOptions(
      store.getState().reference.curriculumOptions,
      "MEDICAL_CURRICULUM"
    );
  const pd = traineeProfileData.personalDetails;
  const programme = ProfileUtilities.getRecentProgramme(
    traineeProfileData.programmeMemberships
  );
  const curriculum = ProfileUtilities.getCurriculum(programme);

  return {
    forename: pd?.forenames,
    surname: pd?.surname,
    gmcNumber: pd?.gmcNumber,
    localOfficeName: isValidOption("localOffice", pd?.personOwner, refData),
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
    programmeSpecialty: isValidOption(
      "curriculum",
      curriculum?.curriculumName,
      null,
      filteredCurriculumData
    ),
    cctSpecialty1: isValidOption("curriculum", curriculum?.curriculumName),
    cctSpecialty2: "",
    college: "",
    completionDate: programme?.programmeCompletionDate ?? null,
    trainingGrade: "",
    startDate: programme?.startDate ?? null,
    programmeMembershipType: "",
    wholeTimeEquivalent: "",
    declarationType: "",
    otherImmigrationStatus: "",
    traineeTisId: traineeProfileData.traineeTisId,
    lifecycleState: LifeCycleState.New,
    submissionDate: null,
    lastModifiedDate: null
  };
}

// Bug fix to also reset the option to empty string where no match against filtered curric data e.g. programmeSpecialty field.
function isValidOption(
  key: string,
  option: string | null | undefined,
  refData?: any,
  filteredCurriculumData?: any
): string {
  const searchedArray = refData ? refData[key] : filteredCurriculumData;
  const result = searchedArray?.some(
    (item: { label: string | null | undefined }) => item.label === option
  );
  return result ? option!! : "";
}
