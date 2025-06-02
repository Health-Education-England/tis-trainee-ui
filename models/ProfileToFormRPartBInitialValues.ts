import { TraineeProfile } from "./TraineeProfile";
import { FormRPartB, Work } from "./FormRPartB";
import { LifeCycleState } from "./LifeCycleState";
import { ProfileUtilities } from "../utilities/ProfileUtilities";
import { StringUtilities } from "../utilities/StringUtilities";
import { LinkedFormRDataType } from "../components/forms/form-linker/FormLinkerForm";

export function ProfileToFormRPartBInitialValues(
  traineeProfileData: TraineeProfile,
  linkedFormRData?: LinkedFormRDataType
): FormRPartB {
  const pd = traineeProfileData.personalDetails;
  const work = traineeProfileData.placements.map<Work>(placement => ({
    typeOfWork: StringUtilities.argsToString(
      placement.placementType,
      placement.grade,
      placement.specialty
    ),
    startDate: placement.startDate,
    endDate: placement.endDate,
    site: placement.site,
    siteLocation: placement.siteLocation,
    siteKnownAs: placement.siteKnownAs,
    trainingPost: ProfileUtilities.getTrainingPostInitVal(placement)
  }));

  const workFilteredSorted = ProfileUtilities.sortedTrimmedWork(work);

  return {
    forename: pd?.forenames,
    surname: pd?.surname,
    gmcNumber: pd?.gmcNumber,
    email: "",
    localOfficeName: linkedFormRData?.localOfficeName,
    prevRevalBody: pd?.prevRevalBody,
    prevRevalBodyOther: pd?.prevRevalBodyOther,
    currRevalDate: pd?.currRevalDate,
    prevRevalDate: pd?.prevRevalDate,
    programmeSpecialty: linkedFormRData?.linkedProgramme?.programmeName,
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
    previousDeclarations: null,
    previousDeclarationSummary: "",
    haveCurrentDeclarations: "",
    haveCurrentUnresolvedDeclarations: "",
    currentDeclarations: null,
    havePreviousUnresolvedDeclarations: "",
    currentDeclarationSummary: "",
    compliments: "",
    haveCovidDeclarations: null,
    covidDeclarationDto: null,
    lifecycleState: LifeCycleState.New,
    submissionDate: null,
    lastModifiedDate: null,
    isDeclarationAccepted: false,
    isConsentAccepted: false,
    isArcp: linkedFormRData?.isArcp,
    programmeMembershipId: linkedFormRData?.programmeMembershipId
  };
}
