import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { useIsLtftPilot } from "./useIsLtftPilot";
import {
  fetchLtftSummaryList,
  updatedLtftFormsRefreshNeeded
} from "../../redux/slices/ltftSummaryListSlice";
import { resetForm } from "../FormBuilderUtilities";

export const useLtftHomeStartover = () => {
  const dispatch = useAppDispatch();
  const isLtftPilot = useIsLtftPilot();
  const needLtftFormsRefresh = useAppSelector(
    state => state.ltftSummaryList?.ltftFormsRefreshNeeded
  );

  useEffect(() => {
    if (isLtftPilot) {
      dispatch(fetchLtftSummaryList());
      updatedLtftFormsRefreshNeeded(false);
      resetForm("ltft");
    }
  }, [dispatch, isLtftPilot, needLtftFormsRefresh]);
};
