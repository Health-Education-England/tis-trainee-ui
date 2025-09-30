import { FeatureFlag } from "./FeatureFlags";

export interface HomeCardProps {
  linkHeader: string;
  isFeatureEnabled: FeatureFlag;
  isClickable: boolean;
  route: string;
  items: HomeCardItemProps[];
}

export interface HomeCardItemProps {
  text: string;
  isFeatureEnabled: FeatureFlag;
}
