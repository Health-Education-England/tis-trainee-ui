import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import {
  loadSavedCctCalculation,
  resetCctCalculation
} from "../../../redux/slices/cctSlice";
import Loading from "../../common/Loading";
import { CctForm } from "./CctForm";
import { CctRequestError } from "./CctRequestError";

const CCT_NOT_FOUND_STATUSES = new Set([400, 403, 404]);

export function CctSavedCalculation() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { calculation, loadStatus, loadErrorStatus } = useAppSelector(
    state => state.cct
  );
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    void dispatch(loadSavedCctCalculation(id));
    return () => {
      dispatch(resetCctCalculation());
    };
  }, [id, dispatch]);

  const retry = async () => {
    setIsRetrying(true);
    await dispatch(loadSavedCctCalculation(id));
    setIsRetrying(false);
  };

  if (loadStatus === "succeeded" && calculation?.id === id) {
    return <CctForm savedCalculation={calculation} />;
  }

  if (
    loadStatus === "failed" &&
    loadErrorStatus !== null &&
    CCT_NOT_FOUND_STATUSES.has(loadErrorStatus)
  ) {
    return (
      <>
        <p data-cy="cct-calculation-not-found">
          We could not find this calculation.
        </p>
        <p>
          <Link to="/cct" data-cy="cct-home-link">
            Back to your calculations
          </Link>
        </p>
      </>
    );
  }

  if (loadStatus === "failed" || isRetrying) {
    return (
      <CctRequestError
        isRetrying={isRetrying}
        onRetry={retry}
        message="We could not load your calculation."
      />
    );
  }

  return <Loading />;
}
