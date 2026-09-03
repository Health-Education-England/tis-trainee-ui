import dayjs from "dayjs";
import { ARCP_OPTIONS } from "../Constants";
import { selectTraineeProfile } from "../../redux/slices/traineeProfileSlice";
import { useAppSelector } from "../../redux/hooks/hooks";
import {
  filterProgrammesForLinker,
  sortProgrammesForLinker
} from "../FormRUtilities";
import { ProgrammeMembership } from "../../models/ProgrammeMembership";

export const useLinkageOptions = () => {
  const programmesArr =
    useAppSelector(selectTraineeProfile).programmeMemberships ?? [];

  const linkedProgrammeOptions = sortProgrammesForLinker(
    [
      ...filterProgrammesForLinker(programmesArr, true),
      ...filterProgrammesForLinker(programmesArr, false)
    ].filter((p, i, arr) => arr.findIndex(x => x.tisId === p.tisId) === i)
  ).map((programme: ProgrammeMembership) => ({
    label: `${programme.programmeName} (start: ${dayjs(
      programme.startDate
    ).format("DD/MM/YYYY")})`,
    value: programme.tisId
  }));

  return {
    arcpOptions: ARCP_OPTIONS,
    linkedProgrammeOptions
  };
};
