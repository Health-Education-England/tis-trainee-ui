import dayjs from "dayjs";
import { Card, Fieldset, Table } from "nhsuk-react-components";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import style from "../Common.module.scss";
import { useEffect } from "react";
import { resetMfaJourney } from "../../redux/slices/userSlice";
import { groupAllActionsByProgrammeMembership } from "../../utilities/TraineeActionsUtilities";
import { TraineeAction } from "../../models/TraineeAction";

export default function ActionSummary() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetMfaJourney());
  }, [dispatch]);

  const traineeProfile = useAppSelector(
    state => state.traineeProfile.traineeProfileData
  );

  const programmeMemberships = traineeProfile.programmeMemberships;
  const traineeOutstandingActions = useAppSelector(
    state => state.traineeActions.traineeActionsData
  );
  const groupedOutstandingActions = groupAllActionsByProgrammeMembership(
    traineeOutstandingActions,
    programmeMemberships,
    traineeProfile
  );

  return (
    <div data-cy="actionSummary">
      <Fieldset>
        <Fieldset.Legend
          isPageHeading
          className={style.fieldLegHeader}
          data-cy="actionSummaryHeading"
        >
          Action Summary
        </Fieldset.Legend>
      </Fieldset>
      {groupedOutstandingActions.length === 0 ? (
        <p className="nhsuk-body" data-cy="noOutstandingActions">
          No outstanding actions for any programme membership.
        </p>
      ) : (
        groupedOutstandingActions.map(group => (
          <Card key={group["Programme ID"]}>
            <Card.Content>
              <Card.Heading>{group["Programme Membership name"]}</Card.Heading>
              <Table responsive>
                <Table.Head>
                  <Table.Row>
                    <Table.Cell>Action</Table.Cell>
                    <Table.Cell>Due From</Table.Cell>
                    <Table.Cell>Status</Table.Cell>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {group["Outstanding actions"].map(action => {
                    if (!action.type) return null;
                    const actionInfo = getActionTypeInfo(action);
                    if (!actionInfo) return null;
                    const { label, link } = actionInfo;
                    return (
                      <Table.Row key={action.id}>
                        <Table.Cell>
                          <Link to={link}>{label}</Link>
                        </Table.Cell>
                        <Table.Cell>
                          {dayjs(action.availableFrom).format("DD/MM/YYYY")}
                        </Table.Cell>
                        <Table.Cell>
                          <span>
                            <FontAwesomeIcon
                              icon={faExclamationCircle}
                              color="red"
                            />{" "}
                            Outstanding
                          </span>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            </Card.Content>
          </Card>
        ))
      )}
    </div>
  );
}

function getActionTypeInfo(action: TraineeAction) {
  if (action.type === "REVIEW_DATA") {
    const referenceType = action.tisReferenceInfo?.type;

    if (referenceType === "PLACEMENT") {
      return {
        label: "Review your Placement Details",
        link: "/placements"
      };
    } else if (referenceType === "PROGRAMME_MEMBERSHIP") {
      return {
        label: "Agree your Programme Details",
        link: "/programmes"
      };
    }
  }

  const actionTypeMap: Record<string, { label: string; link: string }> = {
    SIGN_COJ: {
      label: "Sign your Conditions of Joining",
      link: `/programmes/${action.tisReferenceInfo.id}/sign-coj`
    },
    SIGN_FORM_R_PART_A: {
      label: "Submit a new Form R Part A",
      link: "/formr-a"
    },
    SIGN_FORM_R_PART_B: {
      label: "Submit a new Form R Part B",
      link: "/formr-b"
    }
  };

  const typeInfo = actionTypeMap[action.type];
  if (!typeInfo) {
    console.warn(`Unknown action type: ${action.type}`);
    return null;
  }

  return {
    label: typeInfo.label,
    link: typeInfo.link
  };
}
