import { Button, SummaryList } from "nhsuk-react-components";
import { ConditionsOfJoining as ConditionsOfJoiningModel } from "../../models/ProgrammeMembership";
import {
  updatedsigningCoj,
  updatedsigningCojPmId,
  updatedsigningCojProgName
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
      <SummaryList.Row>
        <SummaryList.Value
          onClick={() => viewCoj(programmeMembershipId, programmeName)}
          className="plain-text-link"
          data-cy={`cojViewBtn-${programmeMembershipId}`}
          style={{
            textDecoration: "underline",
            cursor: "pointer",
            whiteSpace: "nowrap"
          }}
        >
          View Signed Condition of Joining
        </SummaryList.Value>
      </SummaryList.Row>
    </SummaryList>
  ) : (
    <SummaryList data-cy="unsignedCoj">
      <SummaryList.Row>
        <SummaryList.Value style={{ borderBottom: 0 }} data-cy="cojStatusText">
          {CojUtilities.getStatusText(startDate)}
        </SummaryList.Value>
        {startDate && CojUtilities.canBeSigned(new Date(startDate)) ? (
          <SummaryList.Actions style={{ borderBottom: 0 }}>
            <Button
              secondary
              onClick={() => viewCoj(programmeMembershipId, programmeName)}
              data-cy={`cojSignBtn-${programmeMembershipId}`}
            >
              Sign
            </Button>
          </SummaryList.Actions>
        ) : null}
      </SummaryList.Row>
    </SummaryList>
  );
}

function viewCoj(programmeMembershipId: string, programmeName: string) {
  store.dispatch(updatedsigningCojProgName(programmeName));
  store.dispatch(updatedsigningCojPmId(programmeMembershipId));
  store.dispatch(updatedsigningCoj(true));
  history.push(`/programmes/${programmeMembershipId}/sign-coj`);
}
