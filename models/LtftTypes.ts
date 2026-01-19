import { SaveStatusProps } from "../components/forms/AutosaveMessage";
import { CctCalculation, CctType } from "../redux/slices/cctSlice";
import { ProfileSType } from "../utilities/ProfileUtilities";

export type LtftFormStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNSUBMITTED"
  | "WITHDRAWN"
  | "APPROVED"
  | "REJECTED";

export type LtftCctChange = {
  id?: string | null;
  calculationId?: string | null;
  cctDate: Date | string | null;
  type: CctType;
  startDate: Date | string | null;
  endDate?: Date | string | null;
  wte: number;
};

export type LtftDeclarations = {
  discussedWithTpd: boolean | null;
  informationIsCorrect: boolean | null;
  notGuaranteed: boolean | null;
};

export type LtftDiscussion = {
  name?: string | null;
  email?: string | null;
  role?: string | null;
};

export type LtftStatusDetails = {
  reason: string | null;
  message: string | null;
};

export type LtftPd = {
  title?: ProfileSType;
  surname: ProfileSType;
  forenames: ProfileSType;
  telephoneNumber: ProfileSType;
  mobileNumber: ProfileSType;
  email: ProfileSType;
  gmcNumber: ProfileSType;
  gdcNumber: ProfileSType;
  publicHealthNumber: ProfileSType;
  skilledWorkerVisaHolder: boolean | null;
};

export type LtftPm = {
  id: string;
  name: string;
  startDate: Date | string;
  endDate: Date | string;
  wte: number;
  designatedBodyCode: string;
  managingDeanery: string;
};

export type StatusLtft = {
  current: StatusInfo;
  history: StatusInfo[];
};

export type StatusInfo = {
  state: LtftFormStatus;
  detail: LtftStatusDetails;
  modifiedBy: LtftDiscussion;
  timestamp: string;
  revision: number;
};

export type LtftObjNew = {
  // LTFT form identifiers
  traineeTisId?: string;
  id?: string;
  formRef?: string;
  name?: string;
  status: StatusLtft;
  created?: Date | string;
  lastModified?: Date | string;

  // PM stuff
  pmId: string;
  pmName: string;
  pmStartDate: Date | string;
  pmEndDate: Date | string;
  designatedBodyCode: string;
  managingDeanery: string;

  // change: LtftCctChange
  cctDate: Date | string | null;
  type: CctType;
  startDate: Date | string | null;
  wteBeforeChange: number | null; // currently belongs to PM but needed here for ease of use
  wte: number | null;

  // declarations
  declarations: LtftDeclarations;

  // discussions
  tpdName: string;
  tpdEmail: string;
  otherDiscussions: LtftDiscussion[] | null;

  // reasons
  reasonsSelected: string[] | null;
  reasonsOtherDetail: string | null;
  supportingInformation: string | null;

  // Personal details
  personalDetails: Omit<LtftPd, "skilledWorkerVisaHolder">;

  // skilledWorkerVisaHolder moved to separate field
  skilledWorkerVisaHolder: boolean | null;
};

export type LtftState = {
  formData: LtftObjNew;
  LtftCctSnapshot: CctCalculation;
  status: string;
  error: any;
  canEdit: boolean;
  editPageNumber: number;
  saveStatus: SaveStatusProps;
  newFormId: string | undefined;
  saveLatestTimeStamp: string;
};

export type LtftDto = {
  traineeTisId: string;
  id: string | null;
  formRef: string | null;
  revision?: number;
  name: string | null;
  change: LtftCctChange;
  declarations: {
    discussedWithTpd: boolean | null;
    informationIsCorrect: boolean | null;
    notGuaranteed: boolean | null;
  };
  discussions: {
    tpdName: string;
    tpdEmail: string;
    other: {
      name: string;
      email: string;
      role: string;
    }[];
  };
  personalDetails: {
    id?: string;
    title?: ProfileSType;
    forenames: ProfileSType;
    surname: ProfileSType;
    telephoneNumber?: string | null;
    mobileNumber?: string | null;
    email: ProfileSType;
    gmcNumber?: string | null;
    gdcNumber?: string | null;
    publicHealthNumber?: string | null;
    skilledWorkerVisaHolder: boolean | null;
  };
  programmeMembership: {
    id: string;
    name: string;
    startDate: Date | string;
    endDate?: Date | string;
    wte: number;
    designatedBodyCode?: string;
    managingDeanery?: string;
  };
  reasons: {
    selected: string[];
    otherDetail?: string;
    supportingInformation: string | null;
  };
  tpdEmailStatus?: unknown;
  status: {
    current: StatusInfo;
    submitted?: unknown;
    history: StatusInfo[];
  };
  created: Date | string;
  lastModified: Date | string;
};

export type LtftSummaryObj = {
  id: string;
  name: string;
  programmeMembershipId: string;
  formRef: string;
  status: string;
  statusReason: string;
  statusMessage: string;
  modifiedByRole: string;
  created: string;
  lastModified: string;
};

export type LtftSummaryList = {
  ltftList: LtftSummaryObj[];
  status: string;
  error: any;
  ltftFormsRefreshNeeded: boolean;
};
