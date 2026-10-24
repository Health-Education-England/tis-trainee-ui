import {
  CctChangeDto,
  CctProgrammeDetails,
  CctResult
} from "../models/CctTypes";
import { calculateCctResult } from "./mock-cct-engine";
import {
  CctValidationError,
  validateCctCalculateRequest
} from "./mock-cct-validation";

export type CctProblemDetail = {
  type: "about:blank";
  title: "Validation failure";
  status: 400;
  instance: string;
  errors: CctValidationError[];
};

export type MockCctResponse =
  | { status: 200; body: CctResult }
  | { status: 400; body: CctProblemDetail };

export function mockCctCalculate(
  programmeDetails: CctProgrammeDetails,
  changes: CctChangeDto[]
): MockCctResponse {
  const errors = validateCctCalculateRequest(programmeDetails, changes);
  if (errors.length > 0)
    return {
      status: 400,
      body: {
        type: "about:blank",
        title: "Validation failure",
        status: 400,
        instance: "/api/cct/calculate",
        errors
      }
    };
  return { status: 200, body: calculateCctResult(programmeDetails, changes) };
}
