import { Button } from "nhsuk-react-components";
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
  const statusText = getStatusText(startDate);

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
        <div>{statusText}</div>
      )}
      {statusText === "Not signed" ? (
        <>
          <Button onClick={() => {}} data-cy="goToCojBtn">
            Sign Condition of Joining Form
          </Button>
        </>
      ) : statusText.includes("Signed on") ? (
        <>
          {
            <a
              href="FutureLinkToCoJform"
              onClick={() => {}}
              data-cy="goToCojBtn"
            >
              View Signed Form
            </a>
          }
        </>
      ) : null}
    </>
  );
}
