import ApiService, { ApiError } from "./apiService";
import { CctCalculation, CctResult } from "../models/CctTypes";

export type CctCalculateRequest = Pick<
  CctCalculation,
  "programmeDetails" | "changes"
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
      const { mockCctCalculate } = await import("../mock-data/mock-cct-api");
      await new Promise(resolve => setTimeout(resolve, STUB_LATENCY_MS));
      const response = mockCctCalculate(
        request.programmeDetails,
        request.changes
      );
      if (response.status === 400)
        throw new ApiError({
          data: response.body,
          status: response.status,
          statusText: "Bad Request",
          headers: {},
          config: {}
        });
      return response.body;
    }

    const { data } = await this.post<CctResult, CctCalculateRequest>(
      "/cct/calculate",
      request
    );
    return data;
  }
}
