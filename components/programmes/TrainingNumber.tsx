import { ConditionsOfJoining as ConditionsOfJoiningModel } from "../../models/ProgrammeMembership";
import { CojUtilities } from "../../utilities/CojUtilities";
import { useInfoActions } from "../../utilities/hooks/action-summary/useInfoActions";
import { ProfileSType } from "../../utilities/ProfileUtilities";

type TrainingNumberProps = {
  conditionsOfJoining: ConditionsOfJoiningModel;
  startDate: string | null;
  trainingNumber: string | null;
  gmcNumber: ProfileSType;
  gdcNumber: ProfileSType;
};

export function TrainingNumber({
  conditionsOfJoining,
  startDate,
  trainingNumber,
  gmcNumber,
  gdcNumber
}: Readonly<TrainingNumberProps>) {
  const requiresCoj =
    !conditionsOfJoining.signedAt &&
    startDate &&
    CojUtilities.canBeSigned(new Date(startDate));

  const { noSubFormRA, noSubFormRB, infoActionsA, infoActionsB } =
    useInfoActions();

  const requiresFormRA = noSubFormRA || infoActionsA.isForInfoYearPlusSubForm;
  const requiresFormRB = noSubFormRB || infoActionsB.isForInfoYearPlusSubForm;
  const requiresGmc =
    gmcNumber == null || gmcNumber == undefined || !/^\d{7}$/.test(gmcNumber);
  const requiresGdc =
    gdcNumber == null || gdcNumber == undefined || !/^\d{5}$/.test(gdcNumber);
  const requiresGmcOrGdc = requiresGmc && requiresGdc;

  return !trainingNumber ||
    (!requiresCoj &&
      !requiresFormRA &&
      !requiresFormRB &&
      !requiresGmcOrGdc) ? (
    <div data-cy="trainingNumberText">{trainingNumber ?? "Not Available"}</div>
  ) : (
    <div>
      Available after submitting:
      <ul>
        {requiresCoj && <li data-cy="requireCoj">Conditions of Joining</li>}
        {requiresFormRA && <li data-cy="requireFormRA">Form R Part A</li>}
        {requiresFormRB && <li data-cy="requireFormRB">Form R Part B</li>}
        {requiresGmcOrGdc && (
          <li data-cy="requireGmcOrGdc">Personal GMC/GDC no.</li>
        )}
      </ul>
    </div>
  );
}
