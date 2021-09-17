import { TraineeProfile } from "./TraineeProfile";
import { FormRPartB, Work } from "./FormRPartB";
import { MEDICAL_CURRICULUM } from "../utilities/Constants";
import { LifeCycleState } from "./LifeCycleState";

export function ProfileToFormRPartBInitialValues(
  traineeProfile: TraineeProfile | null
): FormRPartB | null {
  if (!traineeProfile) {
    return null;
  }
  const pd = traineeProfile.personalDetails;

  const programme =
    traineeProfile.programmeMemberships.length > 0
      ? traineeProfile.programmeMemberships.reduce(function (a, b) {
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

  const work = traineeProfile.placements.map<Work>(placement => ({
    typeOfWork: `${placement.placementType} ${placement.grade} ${placement.specialty}`,
    startDate: placement.startDate,
    endDate: placement.endDate,
    site: placement.site,
    siteLocation: placement.siteLocation,
    trainingPost: placement.placementType === "In Post" ? "Yes" : ""
  }));

  const model: FormRPartB = {
    forename: pd?.forenames || "",
    surname: pd?.surname || "",
    gmcNumber: pd?.gmcNumber || "",
    email: "",
    localOfficeName: pd?.personOwner || "",
    prevRevalBody: pd?.prevRevalBody || "",
    prevRevalBodyOther: pd?.prevRevalBodyOther || "",
    currRevalDate: pd?.currRevalDate || undefined,
    prevRevalDate: pd?.prevRevalDate || undefined,
    programmeSpecialty: curriculum?.curriculumName || "",
    dualSpecialty: "",
    traineeTisId: traineeProfile.traineeTisId,
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
    currentDeclarations: [],
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
  return model;
}
