import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import {
  CctReferenceStatus,
  fetchCctSpecialties
} from "../../redux/slices/cctReferenceSlice";

export type CctSpecialtiesStatus = "loading" | "succeeded" | "failed";

const toSpecialtiesStatus = (
  status: CctReferenceStatus,
  hasFailed: boolean
): CctSpecialtiesStatus => {
  if (hasFailed) return "failed";
  return status === "succeeded" ? "succeeded" : "loading";
};

export function useCctSpecialties() {
  const dispatch = useAppDispatch();
  const { specialties, status, error } = useAppSelector(
    state => state.cctReference
  );
  const hasFailed = error !== null;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCctSpecialties());
    }
  }, [status, dispatch]);

  const retry = () => {
    dispatch(fetchCctSpecialties());
  };

  return {
    specialties,
    status: toSpecialtiesStatus(status, hasFailed),
    isRetrying: hasFailed && status === "loading",
    retry
  };
}
