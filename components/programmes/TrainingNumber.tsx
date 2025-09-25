import { Link } from "react-router-dom";
import { ProfileSType } from "../../utilities/ProfileUtilities";
import { useTraineeActions } from "../../utilities/hooks/useTraineeActions";
import { calcTrainingNumStatus } from "../../utilities/OnboardingTrackerUtilities";

type TrainingNumberProps = {
  trainingNumber: string | null;
  gmcNumber: ProfileSType;
  gdcNumber: ProfileSType;
  panelId: string;
};

export function TrainingNumber({
  trainingNumber,
  gmcNumber,
  gdcNumber,
  panelId
}: Readonly<TrainingNumberProps>) {
  const { filteredActionsBelongingToThisProg } = useTraineeActions(panelId);
  const { details } = calcTrainingNumStatus(filteredActionsBelongingToThisProg);

  const requiresCoj = details["SIGN_COJ"] === "outstanding";
  const requiresFormRA = details["SIGN_FORM_R_PART_A"] === "outstanding";
  const requiresFormRB = details["SIGN_FORM_R_PART_B"] === "outstanding";
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
