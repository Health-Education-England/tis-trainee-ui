import { TraineeProfile } from "./TraineeProfile";
import { FormRPartB, Work } from "./FormRPartB";
import { LifeCycleState } from "./LifeCycleState";
import { ProfileUtilities } from "../utilities/ProfileUtilities";

export function ProfileToFormRPartBInitialValues(
  traineeProfileData: TraineeProfile
): FormRPartB {
  const pd = traineeProfileData.personalDetails;
  const programme = ProfileUtilities.getRecentProgramme(
    traineeProfileData.programmeMemberships
  );
  const curriculum = ProfileUtilities.getCurriculum(programme);
  const work = traineeProfileData.placements.map<Work>(placement =>
    ProfileUtilities.mappedPltoWork(placement)
  );

  const workFilteredSorted = ProfileUtilities.sortedTrimmedWork(work);

  return {
    forename: pd?.forenames,
    surname: pd?.surname,
    gmcNumber: pd?.gmcNumber,
    email: "",
    localOfficeName: pd?.personOwner,
    prevRevalBody: pd?.prevRevalBody,
    prevRevalBodyOther: pd?.prevRevalBodyOther,
    currRevalDate: pd?.currRevalDate,
    prevRevalDate: pd?.prevRevalDate,
    programmeSpecialty: curriculum?.curriculumName ?? null,
    dualSpecialty: "",
    traineeTisId: traineeProfileData.traineeTisId,
    work: workFilteredSorted,
    sicknessAbsence: 0,
    parentalLeave: 0,
    careerBreaks: 0,
    paidLeave: 0,
    unauthorisedLeave: 0,
    otherLeave: 0,
    totalLeave: 0,
    isHonest: "",
    isHealthy: "",
    isWarned: "",
    isComplying: "",
    healthStatement: "",
    havePreviousDeclarations: "",
    previousDeclarations: [],
    previousDeclarationSummary: "",
    haveCurrentDeclarations: "",
    haveCurrentUnresolvedDeclarations: "",
    currentDeclarations: [],
    havePreviousUnresolvedDeclarations: "",
    currentDeclarationSummary: "",
    compliments: "",
    haveCovidDeclarations: "",
    covidDeclarationDto: null,
    lifecycleState: LifeCycleState.New,
    submissionDate: null,
    lastModifiedDate: null,
    isDeclarationAccepted: false,
    isConsentAccepted: false,
    arcpYear: null
  };
}
