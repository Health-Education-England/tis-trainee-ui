import { Status } from "./Status";

export interface Placement {
  tisId?: string;
  site: string;
  siteLocation: string;
  startDate: Date | string;
  endDate: Date | string;
  wholeTimeEquivalent: string;
  specialty: string;
  grade: string;
  placementType: string;
  employingBody: string;
  trainingBody: string;
  status?: Status;
}

export const placementPanelTemplate: Placement = {
  site: "",
  siteLocation: "",
  startDate: "",
  endDate: "",
  wholeTimeEquivalent: "",
  specialty: "",
  grade: "",
  placementType: "",
  employingBody: "",
  trainingBody: ""
};
