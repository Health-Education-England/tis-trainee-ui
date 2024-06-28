import { ConditionsOfJoining as ConditionsOfJoiningModel } from "../../models/ProgrammeMembership";
import { CojUtilities } from "../../utilities/CojUtilities";
import { useInfoActions } from "../../utilities/hooks/action-summary/useInfoActions";

type TrainingNumberProps = {
  conditionsOfJoining: ConditionsOfJoiningModel;
  startDate: string | null;
  trainingNumber: string | null;
};

export function TrainingNumber({
  conditionsOfJoining,
  startDate,
  trainingNumber
}: Readonly<TrainingNumberProps>) {
  const requiresCoj =
    !conditionsOfJoining.signedAt &&
    startDate &&
    CojUtilities.canBeSigned(new Date(startDate));

  const { noSubFormRA, noSubFormRB, infoActionsA, infoActionsB } =
    useInfoActions();

  const requiresFormRA = noSubFormRA || infoActionsA.isForInfoYearPlusSubForm;
  const requiresFormRB = noSubFormRB || infoActionsB.isForInfoYearPlusSubForm;

  return !trainingNumber ||
    (!requiresCoj && !requiresFormRA && !requiresFormRB) ? (
    <div data-cy="trainingNumberText">{trainingNumber ?? "Not Available"}</div>
  ) : (
    <div>
      Available after submitting:
      <ul>
        {requiresCoj && <li data-cy="requireCoj">Conditions of Joining</li>}
        {requiresFormRA && <li data-cy="requireFormRA">Form R Part A</li>}
        {requiresFormRB && <li data-cy="requireFormRB">Form R Part B</li>}
      </ul>
    </div>
  );
}
