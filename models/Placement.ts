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
  otherSpecialties: SpecialtyType[] | null;
  postAllowsSubspecialty: boolean;
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
  otherSpecialties: [],
  postAllowsSubspecialty: false,
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

export type SpecialtyType = {
  specialtyId: string;
  name: string;
};
