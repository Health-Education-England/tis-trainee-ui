import { useAppSelector } from "../../redux/hooks/hooks";

// Determine if this is a Public Health non-medical trainee
// based on having a PH number and an empty or null GMC/GDC number
export const useIsPhNonMedic = (): boolean => {
  const personalDetails = useAppSelector(
    state => state.traineeProfile.traineeProfileData.personalDetails
  );
  return (
    !!personalDetails?.publicHealthNumber &&
    !personalDetails?.gmcNumber &&
    !personalDetails?.gdcNumber
  );
};
