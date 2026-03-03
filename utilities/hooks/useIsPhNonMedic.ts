import { useAppSelector } from "../../redux/hooks/hooks";

// Detremine if it is a Public Health Non Medic trainee
// if they only have a PH Number and Empty or Null GMC/GDC Number
export const useIsPhNonMedic = (): boolean => {
  const personalDetails = useAppSelector(state => state.traineeProfile.traineeProfileData.personalDetails);
  return !!personalDetails?.publicHealthNumber && !personalDetails?.gmcNumber && !personalDetails?.gdcNumber;
};
