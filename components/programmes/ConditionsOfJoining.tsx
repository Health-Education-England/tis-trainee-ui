import { ConditionsOfJoining as ConditionsOfJoiningModel } from "../../models/ProgrammeMembership";
import {
  updatedsigningCoj,
  updatedsigningCojPmId,
  updatedsigningCojProgName,
  updatedsigningCojCanEdit,
  updatedsigningCojSignedDate
} from "../../redux/slices/userSlice";
import store from "../../redux/store/store";
import { CojUtilities } from "../../utilities/CojUtilities";
import { DateUtilities } from "../../utilities/DateUtilities";
import history from "../navigation/history";

type ConditionsOfJoiningProps = {
  conditionsOfJoining: ConditionsOfJoiningModel;
  startDate: string | null;
  programmeMembershipId: string;
  programmeName: string;
};

export function ConditionsOfJoining({
  conditionsOfJoining,
  startDate,
  programmeMembershipId,
  programmeName
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
      <div className="nhsuk-summary-list__row">
        <dt className="nhsuk-summary-list__key" style={{ borderBottom: 0 }}>
          <dd
            onClick={() =>
              viewCoj(
                programmeMembershipId,
                programmeName,
                false,
                conditionsOfJoining.signedAt
              )
            }
            className="plain-text-link"
            data-cy={`cojViewBtn-${programmeMembershipId}`}
            style={{
              textDecoration: "underline",
              cursor: "pointer",
              whiteSpace: "nowrap"
            }}
          >
            View Signed Condition of Joining
          </dd>
        </dt>
        <dd style={{ borderBottom: 0 }}></dd>
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
              onClick={() =>
                viewCoj(
                  programmeMembershipId,
                  programmeName,
                  true,
                  conditionsOfJoining.signedAt
                )
              }
              data-cy={`cojSignBtn-${programmeMembershipId}`}
            >
              Sign
            </button>
          </dd>
        ) : null}
      </div>
    </dl>
  );
}

function viewCoj(
  programmeMembershipId: string,
  programmeName: string,
  canEdit: boolean,
  signedDate: Date | null
) {
  store.dispatch(updatedsigningCojProgName(programmeName));
  store.dispatch(updatedsigningCojPmId(programmeMembershipId));
  store.dispatch(updatedsigningCojCanEdit(canEdit));
  store.dispatch(updatedsigningCojSignedDate(signedDate));
  store.dispatch(updatedsigningCoj(true));
  history.push(`/programmes/${programmeMembershipId}/sign-coj`);
}
