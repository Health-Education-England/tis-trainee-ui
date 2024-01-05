import { IFormR } from "./IFormR";
import { DateType } from "../utilities/DateUtilities";
import { ProfileSType } from "../utilities/ProfileUtilities";
import { LifeCycleState } from "./LifeCycleState";
export interface FormRPartB extends IFormR {
  traineeTisId?: string;
  forename: ProfileSType;
  surname: ProfileSType;
  gmcNumber: ProfileSType;
  email: string;
  localOfficeName: ProfileSType;
  prevRevalBody: ProfileSType;
  prevRevalBodyOther: ProfileSType;
  currRevalDate: DateType;
  prevRevalDate: DateType;
  programmeSpecialty: ProfileSType;
  dualSpecialty: string;
  work: Work[];
  sicknessAbsence: number;
  parentalLeave: number;
  careerBreaks: number;
  paidLeave: number;
  unauthorisedLeave: number;
  otherLeave: number;
  totalLeave: number;
  isHonest: boolean | string;
  isHealthy: boolean | string;
  isWarned: boolean | string;
  isComplying: boolean | string;
  healthStatement: string;
  havePreviousDeclarations: boolean | string;
  previousDeclarations: Declaration[];
  havePreviousUnresolvedDeclarations: boolean | string;
  previousDeclarationSummary: string;
  haveCurrentDeclarations: boolean | string;
  haveCurrentUnresolvedDeclarations: boolean | string;
  currentDeclarations: Declaration[];
  currentDeclarationSummary: string;
  compliments: string;
  haveCovidDeclarations: boolean | null;
  covidDeclarationDto: CovidDeclaration | null;
  isDeclarationAccepted?: boolean;
  isConsentAccepted?: boolean;
}

export interface Declaration {
  declarationType: string | undefined;
  dateOfEntry: DateType;
  title: string;
  locationOfEntry: string;
}

export interface Work {
  typeOfWork: string;
  startDate: Date | string;
  endDate: Date | string;
  trainingPost: string;
  site: string;
  siteLocation: string;
  siteKnownAs: string;
}

export interface CovidDeclaration {
  selfRateForCovid: string;
  reasonOfSelfRate: string;
  otherInformationForPanel: string;
  discussWithSupervisorChecked: boolean | string;
  discussWithSomeoneChecked: boolean | string;
  haveChangesToPlacement: boolean | string;
  changeCircumstances: string;
  changeCircumstanceOther: string;
  howPlacementAdjusted: string;
  educationSupervisorName: string;
  educationSupervisorEmail: string;
}

export const initialFormRBBeforeProfileData: FormRPartB = {
  forename: "",
  surname: "",
  gmcNumber: "",
  email: "",
  localOfficeName: "",
  prevRevalBody: "",
  prevRevalBodyOther: "",
  currRevalDate: null,
  prevRevalDate: null,
  programmeSpecialty: "",
  dualSpecialty: "",
  work: [],
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
  haveCovidDeclarations: null,
  covidDeclarationDto: null,
  lifecycleState: LifeCycleState.New,
  submissionDate: "",
  lastModifiedDate: "",
  isDeclarationAccepted: false,
  isConsentAccepted: false
};
