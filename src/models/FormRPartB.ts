import { IFormR } from "./IFormR";

type DateType = Date | string | undefined;

export interface FormRPartB extends IFormR {
  traineeTisId?: string;
  forename: string;
  surname: string;
  gmcNumber: string;
  email: string;
  localOfficeName: string;
  prevRevalBody: string;
  currRevalDate: DateType;
  prevRevalDate: Date | string | undefined | null;
  programmeSpecialty: string;
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
  previousDeclarationSummary: string;
  haveCurrentDeclarations: boolean | string;
  currentDeclarations: Declaration[];
  currentDeclarationSummary: string;
  compliments: string;
  haveCovidDeclarations: boolean | string | null;
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
