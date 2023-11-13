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
import React from "react";
import { Button } from "nhsuk-react-components";
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
  const handleClick = () => {
    setCojState(
      programmeMembershipId,
      programmeName,
      conditionsOfJoining.signedAt
    );
    history.push(`/programmes/${programmeMembershipId}/sign-coj`);
  };
  return conditionsOfJoining.signedAt ? (
    <React.Fragment>
      <p data-cy="cojSignedDate">
        {`Signed: ${DateUtilities.ConvertToLondonTime(
          conditionsOfJoining.signedAt
        )}`}
      </p>
      <p data-cy="cojSignedVersion">
        {`Version: ${CojUtilities.getVersionText(conditionsOfJoining.version)}`}
      </p>
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
    </React.Fragment>
  ) : (
    <React.Fragment>
      <p data-cy="cojStatusText">{CojUtilities.getStatusText(startDate)}</p>
      {startDate && CojUtilities.canBeSigned(new Date(startDate)) && (
        <Button
          className="btn_full-width"
          onClick={handleClick}
          data-cy={`cojSignBtn-${programmeMembershipId}`}
        >
          Sign
        </Button>
      )}
    </React.Fragment>
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
