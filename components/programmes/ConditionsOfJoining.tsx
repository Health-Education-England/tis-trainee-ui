import { ConditionsOfJoining as ConditionsOfJoiningModel } from "../../models/ProgrammeMembership";
import { CojUtilities } from "../../utilities/CojUtilities";
import { DateUtilities } from "../../utilities/DateUtilities";

type ConditionsOfJoiningProps = {
  conditionsOfJoining: ConditionsOfJoiningModel;
  startDate: string | null;
};

export function ConditionsOfJoining({
  conditionsOfJoining,
  startDate
}: ConditionsOfJoiningProps) {
  return conditionsOfJoining.signedAt ? (
    <dl className="nhsuk-summary-list" data-cy="signedCoj">
      <div className="nhsuk-summary-list__row">
        <dt className="nhsuk-summary-list__key">Signed</dt>
        <dd className="nhsuk-summary-list__value" data-cy="cojSignedDate">
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
          data-cy="cojSignedVersion"
        >
          {CojUtilities.getVersionText(conditionsOfJoining.version)}
        </dd>
      </div>
    </dl>
  ) : (
    <dl className="nhsuk-summary-list" data-cy="unsignedCoj">
      <div className="nhsuk-summary-list__row">
        <dd
          className="nhsuk-summary-list__value"
          style={{ borderBottom: 0 }}
          data-cy="cojStatusText"
        >
          {CojUtilities.getStatusText(startDate)}
        </dd>
        {startDate && CojUtilities.canBeSigned(new Date(startDate)) ? (
          <dd
            className="nhsuk-summary-list__actions"
            style={{ borderBottom: 0 }}
          >
            <button
              className="nhsuk-button nhsuk-button--secondary"
              data-cy="cojSignBtn"
              onClick={() =>
                alert("We're still working on this feature, check back later.")
              }
            >
              Sign
            </button>
          </dd>
        ) : null}
      </div>
    </dl>
  );
}
