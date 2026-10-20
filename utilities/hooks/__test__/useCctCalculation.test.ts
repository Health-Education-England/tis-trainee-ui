import { act, renderHook, waitFor } from "@testing-library/react";
import {
  CctChange,
  CctProgrammeDetails,
  CctResult
} from "../../../models/CctTypes";
import { CctCalculateRequest, CctService } from "../../../services/CctService";
import { useCctCalculation } from "../useCctCalculation";

const programmeDetails: CctProgrammeDetails = {
  specialty: "Paediatrics",
  startDate: "2023-08-02",
  lengthMonths: 96,
  startGrade: "ST1",
  startGradeOverrideNotes: "",
  additionalMonths: 0,
  additionalMonthsNotes: "",
  acceleratedMonths: 0,
  acceleratedMonthsNotes: "",
  eighteenMonthFinalGrade: null,
  eighteenMonthFinalGradeNotes: "",
  skippedGrade: null,
  skippedGradeNotes: ""
};

const parentalLeave: CctChange = {
  id: "parental",
  type: "PARENTAL",
  startDate: "2024-02-01",
  endDate: "2024-08-01",
  wte: null,
  countsTowardsCompletion: false
};

const resultFor = (cctDate: string): CctResult => ({ cctDate });

describe("useCctCalculation", () => {
  let calculateSpy: jest.SpyInstance;

  beforeEach(() => {
    calculateSpy = jest.spyOn(CctService.prototype, "calculate");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("stays idle and asks for nothing until there are programme details", () => {
    const { result } = renderHook(() => useCctCalculation(null, []));

    expect(result.current.status).toBe("idle");
    expect(result.current.result).toBeNull();
    expect(calculateSpy).not.toHaveBeenCalled();
  });

  it("calculates with an empty changes array as soon as programme details exist", async () => {
    calculateSpy.mockResolvedValue(resultFor("2031-07-29"));

    const { result } = renderHook(() =>
      useCctCalculation(programmeDetails, [])
    );

    await waitFor(() => expect(result.current.status).toBe("succeeded"));
    expect(result.current.result?.cctDate).toBe("2031-07-29");
    expect(calculateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ changes: [] })
    );
  });

  it("sends the changes with their client-only ids stripped", async () => {
    calculateSpy.mockResolvedValue(resultFor("2031-07-29"));

    const { result } = renderHook(() =>
      useCctCalculation(programmeDetails, [parentalLeave])
    );

    await waitFor(() => expect(result.current.status).toBe("succeeded"));
    const sent = calculateSpy.mock.calls[0][0] as CctCalculateRequest;
    expect(sent.changes[0]).not.toHaveProperty("id");
    expect(sent.changes[0].type).toBe("PARENTAL");
  });

  it("reports a failure and holds no result when the call rejects", async () => {
    calculateSpy.mockRejectedValue(new Error("no endpoint yet"));

    const { result } = renderHook(() =>
      useCctCalculation(programmeDetails, [])
    );

    await waitFor(() => expect(result.current.status).toBe("failed"));
    expect(result.current.result).toBeNull();
  });

  it("does not ask again when a re-render brings the same values in new objects", async () => {
    calculateSpy.mockResolvedValue(resultFor("2031-07-29"));

    const { result, rerender } = renderHook(
      ({ changes }: { changes: CctChange[] }) =>
        useCctCalculation({ ...programmeDetails }, changes),
      { initialProps: { changes: [{ ...parentalLeave }] } }
    );

    await waitFor(() => expect(result.current.status).toBe("succeeded"));
    rerender({ changes: [{ ...parentalLeave }] });

    expect(calculateSpy).toHaveBeenCalledTimes(1);
  });

  it("ignores a superseded response that lands after a newer one", async () => {
    let resolveFirst: (value: CctResult) => void = () => {};
    calculateSpy
      .mockReturnValueOnce(
        new Promise<CctResult>(resolve => {
          resolveFirst = resolve;
        })
      )
      .mockResolvedValueOnce(resultFor("2032-01-01"));

    const { result, rerender } = renderHook(
      ({ changes }: { changes: CctChange[] }) =>
        useCctCalculation(programmeDetails, changes),
      { initialProps: { changes: [] as CctChange[] } }
    );

    rerender({ changes: [parentalLeave] });
    await waitFor(() =>
      expect(result.current.result?.cctDate).toBe("2032-01-01")
    );

    await act(async () => {
      resolveFirst(resultFor("2099-12-31"));
    });

    expect(result.current.result?.cctDate).toBe("2032-01-01");
    expect(result.current.status).toBe("succeeded");
  });
});
