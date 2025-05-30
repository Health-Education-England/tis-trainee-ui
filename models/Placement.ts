import { Status } from "./Status";
import { IDateBoxed } from "./IDateBoxed";

export interface Placement extends IDateBoxed {
  site: string;
  siteLocation: string;
  siteKnownAs: string;
  otherSites: Site[];
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

export type SpecialtyType = {
  specialtyId: string;
  name: string;
};
