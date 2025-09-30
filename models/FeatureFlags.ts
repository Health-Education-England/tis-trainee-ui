export interface FeatureFlags {
  formRPartB: {
    covidDeclaration: boolean;
  };
}

export type UserFeaturesType = {
  actions: Feature;
  cct: Feature;
  details: DetailsFeatures;
  forms: FormFeatures;
  notifications: Feature;
}

export type FeatureFlag =
  | boolean
  | ((userFeatures: UserFeaturesType) => boolean);

export type Feature = {
  enabled: boolean;
}

export type DetailsFeatures = {
  enabled: boolean;
  placements: Feature;
  profile: ProfileFeatures;
  programmes: ProgrammeFeatures;
}

export type ProfileFeatures = {
  enabled: boolean;
  gmcUpdate: Feature;
}

export type ProgrammeFeatures = {
  enabled: boolean;
  conditionsOfJoining: Feature;
  confirmation: Feature;
}

export type FormFeatures = {
  enabled: boolean;
  formr: Feature;
  ltft: LtftFeatures;
}

export type LtftFeatures = {
  enabled: boolean;
  qualifyingProgrammes: string[];
}
