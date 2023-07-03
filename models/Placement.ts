import { Signature } from "./Dsp";
import { Status } from "./Status";

export interface Placement {
  tisId?: string;
  site: string;
  siteLocation: string;
  siteKnownAs: string;
  startDate: Date | string;
  endDate: Date | string;
  wholeTimeEquivalent: string;
  specialty: string;
  grade: string;
  placementType: string;
  employingBody: string;
  trainingBody: string;
  status?: Status;
  signature?: Signature;
}

export const placementPanelTemplate: Placement = {
  tisId: "",
  site: "",
  siteLocation: "",
  siteKnownAs: "",
  startDate: "",
  endDate: "",
  wholeTimeEquivalent: "",
  specialty: "",
  grade: "",
  placementType: "",
  employingBody: "",
  trainingBody: ""
};
