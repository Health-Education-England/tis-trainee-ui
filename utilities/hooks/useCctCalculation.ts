import { useEffect, useState } from "react";
import {
  CctChange,
  CctProgrammeDetails,
  CctResult
} from "../../models/CctTypes";
import { CctCalculateRequest, CctService } from "../../services/CctService";
import { deriveCctProjection, toCctChangeDtos } from "../CctUtilities";

export type CctCalculationStatus = "idle" | "loading" | "succeeded" | "failed";

const cctService = new CctService();

export function useCctCalculation(
  programmeDetails: CctProgrammeDetails | null,
  changes: CctChange[]
) {
  const [result, setResult] = useState<CctResult | null>(null);
  const [status, setStatus] = useState<CctCalculationStatus>("idle");

  const projection = deriveCctProjection(programmeDetails, changes);
  const requestKey =
    programmeDetails && projection
      ? JSON.stringify({
          programmeDetails,
          changes: toCctChangeDtos(changes),
          projection
        })
      : "";

  useEffect(() => {
    if (!requestKey) {
      setResult(null);
      setStatus("idle");
      return;
    }

    let isStale = false;
    setStatus("loading");

    cctService
      .calculate(JSON.parse(requestKey) as CctCalculateRequest)
      .then(calculated => {
        if (isStale) return;
        setResult(calculated);
        setStatus("succeeded");
      })
      .catch(() => {
        if (isStale) return;
        setResult(null);
        setStatus("failed");
      });

    return () => {
      isStale = true;
    };
  }, [requestKey]);

  return { result, status };
}
