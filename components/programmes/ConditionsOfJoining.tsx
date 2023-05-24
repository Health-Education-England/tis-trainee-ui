import { SummaryList } from "nhsuk-react-components";
import { Link } from "react-router-dom";
import { ConditionsOfJoining as ConditionsOfJoiningModel } from "../../models/ProgrammeMembership";
import {
  updatedsigningCoj,
  updatedsigningCojPmId,
  updatedsigningCojProgName,
  updatedsigningCojSignedDate
} from "../../redux/slices/userSlice";
import store from "../../redux/store/store";
import { CojUtilities } from "../../utilities/CojUtilities";
import { DateUtilities } from "../../utilities/DateUtilities";

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
    <SummaryList data-cy="signedCoj">
      <SummaryList.Row>
        <SummaryList.Key>Signed</SummaryList.Key>
        <SummaryList.Value data-cy="cojSignedDate">
          {DateUtilities.ToLocalDate(conditionsOfJoining.signedAt)}
        </SummaryList.Value>
      </SummaryList.Row>
      <SummaryList.Row>
        <SummaryList.Key style={{ borderBottom: 0 }}>Version</SummaryList.Key>
        <SummaryList.Value
          style={{ borderBottom: 0 }}
          data-cy="cojSignedVersion"
        >
          {CojUtilities.getVersionText(conditionsOfJoining.version)}
        </SummaryList.Value>
      </SummaryList.Row>
      <SummaryList.Row style={{ borderBottom: 0 }}>
        <SummaryList.Actions style={{ borderBottom: 0 }}>
          <Link
            to={`/programmes/${programmeMembershipId}/sign-coj`}
            onClick={() =>
              setCojState(
                programmeMembershipId,
                programmeName,
                conditionsOfJoining.signedAt
              )
            }
            data-cy={`cojViewBtn-${programmeMembershipId}`}
          >
            View
          </Link>
        </SummaryList.Actions>
      </SummaryList.Row>
    </SummaryList>
  ) : (
    <SummaryList data-cy="unsignedCoj">
      <SummaryList.Row style={{ borderBottom: 0 }}>
        <SummaryList.Value style={{ borderBottom: 0 }} data-cy="cojStatusText">
          {CojUtilities.getStatusText(startDate)}
        </SummaryList.Value>
        {startDate && CojUtilities.canBeSigned(new Date(startDate)) ? (
          <SummaryList.Actions style={{ borderBottom: 0 }}>
            <Link
              to={`/programmes/${programmeMembershipId}/sign-coj`}
              onClick={() =>
                setCojState(
                  programmeMembershipId,
                  programmeName,
                  conditionsOfJoining.signedAt
                )
              }
              data-cy={`cojSignBtn-${programmeMembershipId}`}
            >
              Sign
            </Link>
          </SummaryList.Actions>
        ) : null}
      </SummaryList.Row>
    </SummaryList>
  );
}

function setCojState(
  programmeMembershipId: string,
  programmeName: string,
  signedDate: Date | null
) {
  store.dispatch(updatedsigningCojProgName(programmeName));
  store.dispatch(updatedsigningCojPmId(programmeMembershipId));
  store.dispatch(updatedsigningCoj(true));
  store.dispatch(updatedsigningCojSignedDate(signedDate));
}
