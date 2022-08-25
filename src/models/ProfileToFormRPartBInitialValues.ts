import { TraineeProfile } from "./TraineeProfile";
import { FormRPartB, Work } from "./FormRPartB";
import { NEW_WORK } from "../utilities/Constants";
import { LifeCycleState } from "./LifeCycleState";
import { ProfileUtilities } from "../utilities/ProfileUtilities";
import { StringUtilities } from "../utilities/StringUtilities";

const year = "" + new Date().getFullYear();
const month = ("0" + (new Date().getMonth() + 1)).slice(-2);
const day = ("0" + new Date().getDate()).slice(-2);
const today = year + "-" + month + "-" + day;
const includeAllPlacementsDate = "9999-99-99";

export function ProfileToFormRPartBInitialValues(
  traineeProfileData: TraineeProfile
): FormRPartB {
  const pd = traineeProfileData.personalDetails;
  const programme = ProfileUtilities.getRecentProgramme(
    traineeProfileData.programmeMemberships
  );
  const curriculum = ProfileUtilities.getCurriculum(programme);

  const firstFuturePlacements = traineeProfileData.placements
    .filter(placement => placement.startDate.toString() > today)
    .sort((a, b) => a.startDate > b.startDate ? 1 : -1);
  const nextFutureDate = firstFuturePlacements[0]
    ? firstFuturePlacements[0].startDate.toString() : includeAllPlacementsDate;
  
  const work = traineeProfileData.placements
  .filter(placement => placement.startDate.toString() <= nextFutureDate)
  .map<Work>(placement => ({
    typeOfWork: StringUtilities.argsToString(
      placement.placementType,
      placement.grade,
      placement.specialty
    ),
    startDate: placement.startDate,
    endDate: placement.endDate,
    site: placement.site,
    siteLocation: placement.siteLocation,
    trainingPost: ProfileUtilities.getTrainingPostInitVal(placement)
  }));

  if (work.length > 1) {
    work.sort(
      (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
    );
  } else if (work.length === 0) work.push(NEW_WORK);

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
    programmeSpecialty: curriculum?.curriculumName || null,
    dualSpecialty: "",
    traineeTisId: traineeProfileData.traineeTisId,
    work: work,
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
    isConsentAccepted: false
  };
}
