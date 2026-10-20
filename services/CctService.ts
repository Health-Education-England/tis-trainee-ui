import ApiService from "./apiService";
import { CctCalculation, CctResult } from "../models/CctTypes";

export type CctCalculateRequest = Pick<
  CctCalculation,
  "programmeDetails" | "changes" | "projection"
>;

const STUB_LATENCY_MS = 250;

export const isCctCalculateStubEnabled = (): boolean =>
  process.env.NEXT_PUBLIC_ENVIRONMENT_NAME === "local" &&
  process.env.NEXT_PUBLIC_CCT_CALCULATE_STUB_ENABLED?.toLowerCase() === "true";

export class CctService extends ApiService {
  constructor() {
    super("/api");
  }

  async calculate(request: CctCalculateRequest): Promise<CctResult> {
    if (isCctCalculateStubEnabled()) {
      const { calculateCctResult } = await import(
        "../mock-data/mock-cct-engine"
      );
      await new Promise(resolve => setTimeout(resolve, STUB_LATENCY_MS));
      return calculateCctResult(
        request.programmeDetails,
        request.changes,
        request.projection
      );
    }

    const { data } = await this.post<CctResult, CctCalculateRequest>(
      "/cct/calculate",
      request
    );
    return data;
  }
}
