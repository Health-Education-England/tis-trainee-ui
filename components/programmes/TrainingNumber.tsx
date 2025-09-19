import { Link } from "react-router-dom";
import { ConditionsOfJoining as ConditionsOfJoiningModel } from "../../models/ProgrammeMembership";
import { CojUtilities } from "../../utilities/CojUtilities";
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

  // TODO: Temporarily delete requiresFormRA and requiresFormRB logic - will be re-added in follow-up PR
  const requiresFormRA = false;
  const requiresFormRB = false;
  const isValidGmcNum = !!gmcNumber && /^\d{7}$/.test(gmcNumber);
  const isValidGdcNum = !!gdcNumber && /^\d{5}$/.test(gdcNumber);

  const hasUnmetRequirements = requiresCoj || requiresFormRA || requiresFormRB;
  if (!trainingNumber)
    return <div data-cy="trainingNumberNa">Not Available</div>;

  if ((isValidGmcNum || isValidGdcNum) && !hasUnmetRequirements)
    return <div data-cy="trainingNumberText">{trainingNumber}</div>;

  return (
    <div>
      Available after submitting:
      <ul>
        {requiresCoj && <li data-cy="requireCoj">Conditions of Joining</li>}
        {requiresFormRA && <li data-cy="requireFormRA">Form R Part A</li>}
        {requiresFormRB && <li data-cy="requireFormRB">Form R Part B</li>}
        {(!isValidGmcNum || !isValidGdcNum) && (
          <>
            <li data-cy="requireGmcOrGdc">a valid Personal GMC/GDC no.</li>
            <Link to="/profile">Go to Profile to update</Link>
          </>
        )}
      </ul>
    </div>
  );
}
