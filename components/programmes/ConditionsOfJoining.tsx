import { ConditionsOfJoining } from "../../models/ProgrammeMembership";
import { getStatusText, getVersionText } from "../../utilities/CojUtilities";
import { DateUtilities } from "../../utilities/DateUtilities";

type ConditionsOfJoiningProps = {
  conditionsOfJoining: ConditionsOfJoining;
  startDate: string | null;
};

export function ConditionsOfJoiningField({
  conditionsOfJoining,
  startDate
}: ConditionsOfJoiningProps) {
  return (
    <>
      {conditionsOfJoining.signedAt ? (
        <dl className="nhsuk-summary-list">
          <div className="nhsuk-summary-list__row">
            <dt className="nhsuk-summary-list__key">Signed</dt>
            <dd className="nhsuk-summary-list__value">
              {DateUtilities.ToLocalDate(conditionsOfJoining.signedAt)}
            </dd>
          </div>
          <div className="nhsuk-summary-list__row">
            <dt className="nhsuk-summary-list__key" style={{ borderBottom: 0 }}>
              Version
            </dt>
            <dd
              className="nhsuk-summary-list__value"
              style={{ borderBottom: 0 }}
            >
              {getVersionText(conditionsOfJoining.version)}
            </dd>
          </div>
        </dl>
      ) : (
        <div>{getStatusText(startDate)}</div>
      )}
    </> 
  );
}
