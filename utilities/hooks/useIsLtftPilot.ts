import { useAppSelector } from "../../redux/hooks/hooks";

export const useIsLtftPilot = (): boolean => {
  const features = useAppSelector(state => state.user.features);
  return features?.forms.ltft.enabled ?? false;
};
