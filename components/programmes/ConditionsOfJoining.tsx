import { Link } from "react-router-dom";
import { ConditionsOfJoining as ConditionsOfJoiningModel } from "../../models/ProgrammeMembership";
import { DateUtilities } from "../../utilities/DateUtilities";
import React from "react";
import { COJ_EPOCH } from "../../utilities/Constants";

type ConditionsOfJoiningProps = {
  conditionsOfJoining: ConditionsOfJoiningModel;
  startDate: string | null;
  programmeMembershipId: string;
  programmeName: string;
};

export function ConditionsOfJoining({
  conditionsOfJoining,
  startDate,
  programmeMembershipId
}: ConditionsOfJoiningProps) {
  if (!startDate) return <p data-cy="cojStatusText_Unknown">Unknown status</p>;

  if (new Date(startDate) < COJ_EPOCH) {
    return <p data-cy="cojStatusText_LoProcess">Follow Local Office process</p>;
  }

  const { signedAt, version } = conditionsOfJoining;

  return (
    <>
      {signedAt && (
        <>
          <p data-cy="cojSignedDate">
            {`Signed: ${DateUtilities.ConvertToLondonTime(signedAt)}`}
          </p>
          <p data-cy="cojSignedVersion">
            {`Version: Gold Guide ${version.substring(2)}`}
          </p>
        </>
      )}

      <Link
        to={`/programmes/${programmeMembershipId}/sign-coj`}
        className="btn_full-width"
        data-cy={`cojViewBtn-${programmeMembershipId}`}
      >
        {signedAt ? "View" : "Sign"}
      </Link>
    </>
  );
}
