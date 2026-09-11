import { ARCP_OPTIONS } from "../Constants";
import { selectTraineeProfile } from "../../redux/slices/traineeProfileSlice";
import { useAppSelector } from "../../redux/hooks/hooks";
import {
  filterProgrammesForLinker,
  sortProgrammesForLinker
} from "../FormRUtilities";
import { DateUtilities } from "../DateUtilities";
import { ProgrammeMembership } from "../../models/ProgrammeMembership";

export const useLinkageOptions = (isArcp?: boolean | null) => {
  const programmesArr =
    useAppSelector(selectTraineeProfile).programmeMemberships;

  // Note: isArcp choice can provide diff prog choices, so only filter when the answer is known.
  const linkedProgrammeOptions =
    typeof isArcp !== "boolean" || !programmesArr
      ? []
      : sortProgrammesForLinker(
          filterProgrammesForLinker(programmesArr, isArcp)
        ).map((programme: ProgrammeMembership) => ({
          label: `${
            programme.programmeName
          } (start: ${DateUtilities.ToLocalDate(programme.startDate)})`,
          value: programme.tisId
        }));

  return {
    arcpOptions: ARCP_OPTIONS,
    linkedProgrammeOptions
  };
};
