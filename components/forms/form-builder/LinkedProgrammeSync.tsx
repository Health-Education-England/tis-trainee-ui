import { useEffect } from "react";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { selectTraineeProfile } from "../../../redux/slices/traineeProfileSlice";
import { processLinkedFormData } from "../../../utilities/FormRUtilities";
import { StringUtilities } from "../../../utilities/StringUtilities";
import { useFormContext } from "./FormContext";

export function LinkedProgrammeSync() {
  const { formData, setFormData } = useFormContext();
  const programmesArr =
    useAppSelector(selectTraineeProfile).programmeMemberships ?? [];

  const programmeMembershipId = formData?.programmeMembershipId;
  const isArcp = formData?.isArcp;

  useEffect(() => {
    if (!programmeMembershipId) return;

    const processed = processLinkedFormData(
      {
        isArcp: StringUtilities.convertToBool(isArcp),
        programmeMembershipId
      },
      programmesArr
    );

    if (!processed.linkedProgramme) return;

    const derived = {
      localOfficeName: processed.localOfficeName,
      programmeSpecialty: processed.linkedProgramme.programmeName,
      programmeName: processed.linkedProgramme.programmeName
    };

    setFormData((prev: any) => {
      const hasChanged = Object.entries(derived).some(
        ([key, value]) => prev[key] !== value
      );
      return hasChanged ? { ...prev, ...derived } : prev;
    });
  }, [programmeMembershipId, isArcp, programmesArr, setFormData]);

  return null;
}
