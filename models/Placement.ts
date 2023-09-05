import { Signature } from "./Dsp";
import { Status } from "./Status";

export interface Placement {
  tisId?: string;
  site: string;
  siteLocation: string;
  siteKnownAs: string;
  otherSites: Site[];
  startDate: Date | string;
  endDate: Date | string;
  wholeTimeEquivalent: string;
  specialty: string;
  subSpecialty: string;
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
  otherSites: [],
  startDate: "",
  endDate: "",
  wholeTimeEquivalent: "",
  specialty: "",
  subSpecialty: "",
  grade: "",
  placementType: "",
  employingBody: "",
  trainingBody: ""
};

export interface Site {
  site: string;
  siteKnownAs?: string;
  siteLocation?: string;
}

export interface PlacementGroup {
  future: Placement[];
  upcoming: Placement[];
  current: Placement[];
  past: Placement[];
}
