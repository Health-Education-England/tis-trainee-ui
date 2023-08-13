import React from "react";
import history from "../navigation/history";
import { useAppSelector } from "../../redux/hooks/hooks";
import { useLocation } from "react-router-dom";
import { Button } from "nhsuk-react-components";

export const Startoverbtn = () => {
  const formName = useLocation().pathname.split("/")[1];
  const formId = useAppSelector(state =>
    formName === "formr-a" ? state.formA.formAData.id : state.formB.formBData.id
  );
  const autosaveStatus = useAppSelector(state =>
    formName === "formr-a"
      ? state.formA.autosaveStatus
      : state.formB.autosaveStatus
  );
  const isAutosaving =
    useAppSelector(state => state.formA.autosaveStatus) === "saving";

  return formId || autosaveStatus === "succeeded" ? (
    <Button reverse disabled={isAutosaving}>
      Start over
    </Button>
  ) : null;
};
