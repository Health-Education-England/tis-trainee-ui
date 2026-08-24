// TODO: These are the old CctCalculation shapes that will be updated in the next commits

export type CctType = "LTFT";

export type CctChangeType = {
  id?: string;
  type: CctType | null;
  startDate: Date | string;
  endDate?: Date | string;
  wte: number | null;
};

export type PmType = {
  id: string;
  name: string;
  startDate: Date | string;
  endDate: Date | string;
  wte: number | null;
  designatedBodyCode: string | null;
  managingDeanery: string | null;
};

export type CctCalculation = {
  id?: string;
  traineeTisId?: string;
  name?: string;
  cctDate?: Date | string;
  programmeMembership: PmType;
  changes: CctChangeType[];
  created?: Date | string;
  lastModified?: Date | string;
};
