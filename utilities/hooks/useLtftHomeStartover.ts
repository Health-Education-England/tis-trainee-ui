import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import useIsBetaTester from "./useIsBetaTester";
import {
  fetchLtftSummaryList,
  updatedLtftFormsRefreshNeeded
} from "../../redux/slices/ltftSummaryListSlice";
import { resetForm } from "../FormBuilderUtilities";

export const useLtftHomeStartover = () => {
  const dispatch = useAppDispatch();
  const isBetaTester = useIsBetaTester();
  const needLtftFormsRefresh = useAppSelector(
    state => state.ltftSummaryList?.ltftFormsRefreshNeeded
  );

  useEffect(() => {
    if (isBetaTester) {
      dispatch(fetchLtftSummaryList());
      updatedLtftFormsRefreshNeeded(false);
      resetForm("ltft");
    }
  }, [dispatch, isBetaTester, needLtftFormsRefresh]);
};
