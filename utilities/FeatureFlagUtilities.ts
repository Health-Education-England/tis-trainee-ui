import { FeatureFlag, UserFeaturesType } from "../models/FeatureFlags";

/**
 * Check whether a user feature is enabled.
 * @param featureFlag The feature flag, may be a simple boolean or a function.
 * @param userFeatures The user features to check against.
 * @returns Whether the user feature is enabled.
 */
export const isFeatureEnabled = (
  featureFlag: FeatureFlag,
  userFeatures: UserFeaturesType
) =>
  typeof featureFlag === "function" ? featureFlag(userFeatures) : featureFlag;
