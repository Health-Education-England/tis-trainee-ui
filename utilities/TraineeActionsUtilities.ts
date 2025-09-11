import { ProgrammeMembership } from "../models/ProgrammeMembership";
import { TraineeAction } from "../models/TraineeAction";
import { TraineeProfile } from "../models/TraineeProfile";
import { matchPlacementActionsToProgrammes } from "./ProfileUtilities";

export function groupAllActionsByProgrammeMembership(
  actions: TraineeAction[],
  programmeMemberships: ProgrammeMembership[],
  profile: TraineeProfile
) {
  if (!actions?.length || !programmeMemberships?.length) {
    return [];
  }

  const programmeMap = programmeMemberships.reduce((map, programme) => {
    programme?.tisId && map.set(programme.tisId, programme);
    return map;
  }, new Map<string, ProgrammeMembership>());

  const placementActionToProgrammeMap = matchPlacementActionsToProgrammes(
    actions,
    profile
  );

  const actionsByProgramme = actions.reduce(
    (result, action) => {
      let programmeId: string | undefined;
      if (
        action.tisReferenceInfo?.type === "PROGRAMME_MEMBERSHIP" &&
        action.tisReferenceInfo?.id
      ) {
        programmeId = action.tisReferenceInfo.id;
      } else if (action.tisReferenceInfo?.type === "PLACEMENT" && action.id) {
        programmeId = placementActionToProgrammeMap.get(action.id);
      }
      if (programmeId && programmeMap.has(programmeId)) {
        const programme = programmeMap.get(programmeId)!;

        if (!result.has(programmeId)) {
          result.set(programmeId, {
            "Programme ID": programmeId,
            "Programme Membership name":
              programme.programmeName || "Unknown Programme",
            "Outstanding actions": []
          });
        }
        result.get(programmeId)?.["Outstanding actions"]?.push(action);
      }

      return result;
    },
    new Map<
      string,
      {
        "Programme ID": string;
        "Programme Membership name": string;
        "Outstanding actions": TraineeAction[];
      }
    >()
  );
  return Array.from(actionsByProgramme.values());
}
