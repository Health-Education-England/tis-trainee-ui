import { TraineeProfile } from "./TraineeProfile";
import { FormRPartB, Work } from "./FormRPartB";
import { MEDICAL_CURRICULUM } from "../utilities/Constants";
import { LifeCycleState } from "./LifeCycleState";
import { NEW_WORK } from "../utilities/Constants";

export function ProfileToFormRPartBInitialValues(
  traineeProfileData: TraineeProfile
): FormRPartB {
  const pd = traineeProfileData.personalDetails;

  const programme =
    traineeProfileData.programmeMemberships.length > 0
      ? traineeProfileData.programmeMemberships.reduce((a, b) =>
          a.startDate > b.startDate ? a : b
        )
      : null;

  const curriculum =
    programme && programme.curricula.length > 0
      ? programme.curricula
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
              b: {
                curriculumStartDate: string | number | Date;
                curriculumName: any;
              }
            ) => {
              const diff =
                new Date(b.curriculumStartDate).getTime() -
                new Date(a.curriculumStartDate).getTime();

              return diff === 0
                ? a.curriculumName.localeCompare(b.curriculumName)
                : diff;
            }
          )
          .shift()
      : null;

  const work = traineeProfileData.placements.map<Work>(placement => ({
    typeOfWork: `${placement.placementType} ${placement.grade} ${placement.specialty}`,
    startDate: placement.startDate,
    endDate: placement.endDate,
    site: placement.site,
    siteLocation: placement.siteLocation,
    trainingPost: placement.placementType === "In Post" ? "Yes" : ""
  }));

  if (work.length > 1) {
    work.sort(
      (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
    );
  } else if (work.length === 0) work.push(NEW_WORK);

  const model: FormRPartB = {
    forename: pd?.forenames,
    surname: pd?.surname,
    gmcNumber: pd?.gmcNumber,
    email: "",
    localOfficeName: pd?.personOwner,
    prevRevalBody: pd?.prevRevalBody,
    prevRevalBodyOther: pd?.prevRevalBodyOther,
    currRevalDate: pd?.currRevalDate,
    prevRevalDate: pd?.prevRevalDate,
    programmeSpecialty: curriculum?.curriculumName,
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
