import { useAppSelector } from "../../redux/hooks/hooks";

export const useIsShowNews = (): boolean => {
  const features = useAppSelector(state => state.user.features);
  return features?.news?.enabled ?? false;
};
