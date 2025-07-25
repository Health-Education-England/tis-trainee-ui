import { Card, Fieldset, Label } from "nhsuk-react-components";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationCircle,
  faQuestionCircle
} from "@fortawesome/free-solid-svg-icons";
import Loading from "../common/Loading";
import style from "../Common.module.scss";
import FormMessage from "./FormMessage";
import { DateUtilities } from "../../utilities/DateUtilities";
import { useOutstandingActions } from "../../utilities/hooks/action-summary/useOutstandingActions";
import { useInfoActions } from "../../utilities/hooks/action-summary/useInfoActions";
import { useInProgressActions } from "../../utilities/hooks/action-summary/useInProgressActions";
import DataSourceMsg from "../common/DataSourceMsg";
import { useEffect } from "react";
import { resetMfaJourney } from "../../redux/slices/userSlice";
import { loadFormAList } from "../../redux/slices/formASlice";
import { loadFormBList } from "../../redux/slices/formBSlice";

export default function ActionSummary() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetMfaJourney());
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadFormAList());
    dispatch(loadFormBList());
  }, [dispatch]);

  // OUTSTANDING ACTIONS
  const { unsignedCojCount, programmeActions, placementActions } =
    useOutstandingActions();

  // FORM R SUBMISSIONS (FOR INFO)
  const { noSubFormRA, noSubFormRB, infoActionsA, infoActionsB } =
    useInfoActions();

  // IN PROGRESS
  const { isInProgressFormA, isInProgressFormB } = useInProgressActions();

  const isformRListLoading = useAppSelector(
    state =>
      state.formA.status === "loading" || state.formB.status === "loading"
  );

  if (isformRListLoading) return <Loading />;

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
      <Card.Group>
        <Card.GroupItem width="full">
          <Card>
            <Card.Content>
              <Card feature>
                <Card.Content>
                  <Card.Heading data-cy="outstandingHeading">
                    Outstanding
                  </Card.Heading>
                  {/* ----------------- outstanding ------------- */}
                  {/* **** COJ unsigned ********* */}
                  <ul className="no-bullet">
                    <Label size="l" style={{ color: "#005EB8" }}>
                      Conditions of Joining (Programme)
                    </Label>
                    {unsignedCojCount > 0 && (
                      <li data-cy="unsignedCoJ">
                        <Label size="s">
                          <FontAwesomeIcon
                            icon={faExclamationCircle}
                            color="#DA291C"
                            size="lg"
                          />{" "}
                          You have {unsignedCojCount} unsigned{" "}
                          <Link to="/programmes">
                            {`Conditions of Joining Agreement${
                              unsignedCojCount > 1 ? "s" : ""
                            }`}
                          </Link>
                          .
                        </Label>
                      </li>
                    )}
                    {unsignedCojCount < 1 && (
                      <li data-cy="allCoJSigned">
                        <Label size="s">
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            color="#007F3B"
                            size="lg"
                          />{" "}
                          All your{" "}
                          <Link to="/programmes">
                            Conditions of Joining Agreements
                          </Link>{" "}
                          are signed.
                        </Label>
                      </li>
                    )}
                  </ul>
                  {programmeActions.length > 0 && (
                    <ul className="no-bullet">
                      <Label size="l" style={{ color: "#005EB8" }}>
                        Programme Membership
                      </Label>
                      <li data-cy="incompleteAction">
                        <Label size="s">
                          <FontAwesomeIcon
                            icon={faExclamationCircle}
                            color="#DA291C"
                            size="lg"
                          />{" "}
                          You have {programmeActions.length}{" "}
                          <Link to="/programmes">
                            {`Programme Membership${
                              programmeActions.length > 1 ? "s" : ""
                            }`}
                          </Link>{" "}
                          to review, including training numbers (NTN/DRN) for
                          current and upcoming programmes.
                        </Label>
                      </li>
                    </ul>
                  )}
                  {placementActions.length > 0 && (
                    <ul className="no-bullet">
                      <Label size="l" style={{ color: "#005EB8" }}>
                        Placement
                      </Label>
                      <li data-cy="incompleteAction">
                        <Label size="s">
                          <FontAwesomeIcon
                            icon={faExclamationCircle}
                            color="#DA291C"
                            size="lg"
                          />{" "}
                          You have {placementActions.length}{" "}
                          <Link to="/placements">
                            {`Placement${
                              placementActions.length > 1 ? "s" : ""
                            }`}
                          </Link>{" "}
                          to review.
                        </Label>
                      </li>
                    </ul>
                  )}
                </Card.Content>
              </Card>
              {/* ----------------- Form R submissions (for info) ------ */}
              <Card feature>
                <Card.Content>
                  <Card.Heading data-cy="formRSubsHeading">
                    Form R submissions
                  </Card.Heading>
                  <ul className="no-bullet">
                    {/* **** Form A - LABEL ****/}
                    <Label
                      size="l"
                      style={{ color: "#005EB8" }}
                      data-cy="formASubHeader"
                    >
                      Form R (Part A)
                    </Label>
                    {/* **** Form A - NO SUB ****/}
                    {noSubFormRA && (
                      <FormMessage formType="A" message="infoNoFormEver" />
                    )}
                    {/* **** Form A - SUBMITTED ****/}
                    {/* **** Form A - LATEST SUB DATE WITHIN LAST YEAR ****/}
                    {infoActionsA.latestSubDateForm &&
                      infoActionsA.isForInfoWithinYearSubForm && (
                        <FormMessage
                          formType="A"
                          message="infoLatestSubFormRWithinYear"
                          latestSubFormDate={DateUtilities.ToLocalDate(
                            infoActionsA.latestSubDateForm
                          )}
                        />
                      )}
                    {/* **** Form A - LATEST SUB DATE YEAR PLUS ****/}
                    {infoActionsA.latestSubDateForm &&
                      infoActionsA.isForInfoYearPlusSubForm && (
                        <FormMessage
                          formType="A"
                          message="infoLatestSubFormRYearPlus"
                          latestSubFormDate={DateUtilities.ToLocalDate(
                            infoActionsA.latestSubDateForm
                          )}
                        />
                      )}
                    {/* **** Form B - LABEL ****/}
                    <Label
                      size="l"
                      style={{ color: "#005EB8" }}
                      data-cy="formASubHeader"
                    >
                      Form R (Part B)
                    </Label>
                    {/* **** Form B - NO SUB ****/}
                    {noSubFormRB && (
                      <FormMessage formType="B" message="infoNoFormEver" />
                    )}
                    {/* **** Form B - SUBMITTED ****/}
                    {/* **** Form B - LATEST SUB DATE WITHIN LAST YEAR ****/}
                    {infoActionsB.latestSubDateForm &&
                      infoActionsB.isForInfoWithinYearSubForm && (
                        <FormMessage
                          formType="B"
                          message="infoLatestSubFormRWithinYear"
                          latestSubFormDate={DateUtilities.ToLocalDate(
                            infoActionsB.latestSubDateForm
                          )}
                        />
                      )}
                    {/* **** Form B - LATEST SUB DATE YEAR PLUS ****/}
                    {infoActionsB.latestSubDateForm &&
                      infoActionsB.isForInfoYearPlusSubForm && (
                        <FormMessage
                          formType="B"
                          message="infoLatestSubFormRYearPlus"
                          latestSubFormDate={DateUtilities.ToLocalDate(
                            infoActionsB.latestSubDateForm
                          )}
                        />
                      )}
                  </ul>
                </Card.Content>
              </Card>
              {/* ----------------- In progress ---------------------- */}
              <Card feature>
                <Card.Content>
                  <Card.Heading data-cy="inProgressHeading">
                    In progress
                  </Card.Heading>

                  <ul className="no-bullet">
                    {isInProgressFormA && (
                      <>
                        <Label size="l" style={{ color: "#005EB8" }}>
                          Form R (Part A)
                        </Label>
                        <FormMessage formType="A" message="inProgress" />
                      </>
                    )}
                    {isInProgressFormB && (
                      <>
                        <Label size="l" style={{ color: "#005EB8" }}>
                          Form R (Part B)
                        </Label>
                        <FormMessage formType="B" message="inProgress" />
                      </>
                    )}
                    {!isInProgressFormA && !isInProgressFormB && (
                      <>
                        <Label size="l" style={{ color: "#005EB8" }}>
                          Form R
                        </Label>
                        <li>
                          <Label size="s">
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              color="#007F3B"
                              size="lg"
                            />{" "}
                            You have no saved draft forms.
                          </Label>
                        </li>
                      </>
                    )}
                  </ul>
                </Card.Content>
              </Card>
              <Card feature>
                <Card.Content>
                  <Card.Heading data-cy="otherChecksHeading">
                    Other checks
                  </Card.Heading>
                  <ul className="no-bullet">
                    <li>
                      <Label size="s">
                        <FontAwesomeIcon
                          icon={faQuestionCircle}
                          color="#005EB8"
                          size="lg"
                        />{" "}
                        <>
                          Are your <Link to="/profile">Profile details</Link>,{" "}
                          <Link to="/placements">Placements</Link>, and{" "}
                          <Link to="/programmes">Programmes</Link> correct and
                          up-to-date?
                        </>
                      </Label>
                    </li>
                  </ul>
                  <DataSourceMsg />
                </Card.Content>
              </Card>
            </Card.Content>
          </Card>
        </Card.GroupItem>
        <Card.GroupItem width="full"></Card.GroupItem>
      </Card.Group>
    </div>
  );
}
