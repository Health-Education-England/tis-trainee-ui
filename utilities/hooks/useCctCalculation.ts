import { useEffect, useState } from "react";
import {
  CctCalculateResponse,
  CctChange,
  CctProgrammeDetails
} from "../../models/CctTypes";
import { CctCalculateRequest, CctService } from "../../services/CctService";
import { toCctChangeDtos } from "../CctUtilities";

export type CctCalculationStatus = "idle" | "loading" | "succeeded" | "failed";

const cctService = new CctService();

export function useCctCalculation(
  programmeDetails: CctProgrammeDetails | null,
  changes: CctChange[]
) {
  const [response, setResponse] = useState<CctCalculateResponse | null>(null);
  const [status, setStatus] = useState<CctCalculationStatus>("idle");
  const [attempt, setAttempt] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const requestKey = programmeDetails
    ? JSON.stringify({
        programmeDetails,
        changes: toCctChangeDtos(changes)
      })
    : "";

  useEffect(() => {
    if (!requestKey) {
      setResponse(null);
      setStatus("idle");
      return;
    }

    let isStale = false;
    setStatus(previousStatus =>
      previousStatus === "failed" ? "failed" : "loading"
    );

    cctService
      .calculate(JSON.parse(requestKey) as CctCalculateRequest)
      .then(calculated => {
        if (isStale) return;
        setResponse(calculated);
        setStatus("succeeded");
        setIsRetrying(false);
      })
      .catch(() => {
        if (isStale) return;
        setResponse(null);
        setStatus("failed");
        setIsRetrying(false);
      });

    return () => {
      isStale = true;
    };
  }, [requestKey, attempt]);

  const retry = () => {
    setIsRetrying(true);
    setAttempt(previousAttempt => previousAttempt + 1);
  };

  return {
    result: response?.result ?? null,
    calculatedChanges: response?.changes ?? [],
    status,
    isRetrying,
    retry
  };
}
