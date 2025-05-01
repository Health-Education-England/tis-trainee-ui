import { useAppSelector } from "../../redux/hooks/hooks";

export const useIsLtftEnabled = (): boolean => {
  const features = useAppSelector(state => state.user.features);
  return features?.ltft ?? false;
};
