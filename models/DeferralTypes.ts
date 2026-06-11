import { SaveStatusProps } from "../components/forms/AutosaveMessage";
import { ProfileSType } from "../utilities/ProfileUtilities";

// WIP

export type DeferralFormStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNSUBMITTED"
  | "WITHDRAWN"
  | "APPROVED"
  | "REJECTED";

export type DeferralStatusDetails = {
  reason: string | null;
  message: string | null;
};

export type DeferralModifiedBy = {
  name?: string | null;
  email?: string | null;
  role?: string | null;
};

export type DeferralStatusInfo = {
  state: DeferralFormStatus;
  detail: DeferralStatusDetails;
  modifiedBy: DeferralModifiedBy;
  timestamp: string;
  revision: number;
};

export type StatusDeferral = {
  current: DeferralStatusInfo;
  history: DeferralStatusInfo[];
};

export type DeferralDeclarations = {
  informationIsCorrect: boolean | null;
  notGuaranteed: boolean | null;
};

export type DeferralPd = {
  title?: ProfileSType;
  surname: ProfileSType;
  forenames: ProfileSType;
  telephoneNumber: ProfileSType;
  mobileNumber: ProfileSType;
  email: ProfileSType;
  gmcNumber: ProfileSType;
  gdcNumber: ProfileSType;
  publicHealthNumber: ProfileSType;
};

export type DeferralObj = {
  traineeTisId?: string;
  id?: string;
  formRef?: string;
  name?: string;
  status: StatusDeferral;
  created?: Date | string;
  lastModified?: Date | string;

  pmId: string;
  pmName: string;
  pmStartDate: Date | string;
  pmEndDate: Date | string;

  newStartDate: Date | string | null;

  reasonSelected: string | null;
  reasonOtherDetail: string | null;

  supportingInformation: string | null;

  declarations: DeferralDeclarations;

  personalDetails: DeferralPd;
};

export type DeferralState = {
  formData: DeferralObj;
  status: string;
  error: any;
  canEdit: boolean;
  editPageNumber: number;
  saveStatus: SaveStatusProps;
  newFormId: string | undefined;
  saveLatestTimeStamp: string;
};
