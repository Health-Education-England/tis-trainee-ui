import { ARCP_OPTIONS } from "../Constants";
import { selectTraineeProfile } from "../../redux/slices/traineeProfileSlice";
import { useAppSelector } from "../../redux/hooks/hooks";
import {
  buildFormRPrefill,
  filterProgrammesForLinker,
  getLinkedProgrammeDetails,
  sortProgrammesForLinker
} from "../FormRUtilities";
import { DateUtilities } from "../DateUtilities";
import { ProgrammeMembership } from "../../models/ProgrammeMembership";

const makeProgrammeOption = (programme: ProgrammeMembership) => ({
  label: `${programme.programmeName} (start: ${DateUtilities.ToLocalDate(
    programme.startDate
  )})`,
  value: programme.tisId
});

const buildLinkedProgrammeOptions = (
  programmesArr: ProgrammeMembership[] | undefined,
  isArcp: boolean | null | undefined,
  programmeMembershipId: string | null | undefined
) => {
  if (!programmesArr) return [];

  if (typeof isArcp !== "boolean") {
    const programme = getLinkedProgrammeDetails(
      programmesArr,
      programmeMembershipId
    );
    const isPrefilled =
      buildFormRPrefill(programmesArr, programmeMembershipId).outcome ===
      "prefilled";
    return programme && isPrefilled ? [makeProgrammeOption(programme)] : [];
  }

  return sortProgrammesForLinker(
    filterProgrammesForLinker(programmesArr, isArcp)
  ).map(makeProgrammeOption);
};

export const useLinkageOptions = (
  isArcp?: boolean | null,
  programmeMembershipId?: string | null
) => {
  const programmesArr =
    useAppSelector(selectTraineeProfile).programmeMemberships;

  return {
    arcpOptions: ARCP_OPTIONS,
    linkedProgrammeOptions: buildLinkedProgrammeOptions(
      programmesArr,
      isArcp,
      programmeMembershipId
    )
  };
};
