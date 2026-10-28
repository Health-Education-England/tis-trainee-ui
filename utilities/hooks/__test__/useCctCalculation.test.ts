import { act, renderHook, waitFor } from "@testing-library/react";
import {
  CctBodyValidationError,
  CctCalculateResponse,
  CctChange,
  CctProgrammeDetails
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

const openLtft: CctChange = {
  id: "open-ltft",
  type: "LTFT",
  startDate: "2025-02-01",
  endDate: "",
  wte: 0.6,
  countsTowardsCompletion: true
};

const responseFor = (cctDate: string): CctCalculateResponse => ({
  changes: [],
  result: {
    cctDate,
    originalProgrammeEndDate: "2030-07-29",
    adjustedProgrammeEndDate: "2030-07-29",
    totalWteMonthsCompleted: 6,
    monthsRemaining: 78,
    assumedFullTimePeriods: [],
    projection: {
      startDate: "2024-08-02",
      wte: 1,
      calendarMonths: 78,
      wteMonths: 78
    }
  },
  errors: []
});

const laterStartProgrammeDetails: CctProgrammeDetails = {
  ...programmeDetails,
  startDate: "2024-03-01"
};

const startDateError: CctBodyValidationError = {
  pointer: "#/changes[0]/startDate",
  detail: "Start date cannot be before programme start (01/03/2024)."
};

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
    calculateSpy.mockResolvedValue(responseFor("2031-07-29"));

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
    calculateSpy.mockResolvedValue(responseFor("2031-07-29"));

    const { result } = renderHook(() =>
      useCctCalculation(programmeDetails, [parentalLeave])
    );

    await waitFor(() => expect(result.current.status).toBe("succeeded"));
    const sent = calculateSpy.mock.calls[0][0] as CctCalculateRequest;
    expect(sent.changes[0]).not.toHaveProperty("id");
    expect(sent.changes[0].type).toBe("PARENTAL");
  });

  it("sends an open LTFT change with a null end date and no projection", async () => {
    calculateSpy.mockResolvedValue(responseFor("2031-07-29"));

    const { result } = renderHook(() =>
      useCctCalculation(programmeDetails, [openLtft])
    );

    await waitFor(() => expect(result.current.status).toBe("succeeded"));
    const sent = calculateSpy.mock.calls[0][0] as CctCalculateRequest;
    expect(sent.changes[0].endDate).toBeNull();
    expect(sent).not.toHaveProperty("projection");
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
    calculateSpy.mockResolvedValue(responseFor("2031-07-29"));

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
    let resolveFirst: (value: CctCalculateResponse) => void = () => {};
    calculateSpy
      .mockReturnValueOnce(
        new Promise<CctCalculateResponse>(resolve => {
          resolveFirst = resolve;
        })
      )
      .mockResolvedValueOnce(responseFor("2032-01-01"));

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
      resolveFirst(responseFor("2099-12-31"));
    });

    expect(result.current.result?.cctDate).toBe("2032-01-01");
    expect(result.current.status).toBe("succeeded");
  });

  it("returns the errors that come back with the result", async () => {
    calculateSpy.mockResolvedValue({
      ...responseFor("2031-07-29"),
      errors: [startDateError]
    });

    const { result } = renderHook(() =>
      useCctCalculation(laterStartProgrammeDetails, [parentalLeave])
    );

    await waitFor(() => expect(result.current.status).toBe("succeeded"));
    expect(result.current.errors).toEqual([startDateError]);
  });

  it("drops the last response's errors from the first render with new changes, but keeps its result until the next one lands", async () => {
    calculateSpy
      .mockResolvedValueOnce({
        ...responseFor("2031-07-29"),
        errors: [startDateError]
      })
      .mockReturnValueOnce(new Promise<CctCalculateResponse>(() => {}));
    const errorsByRender: CctBodyValidationError[][] = [];

    const { result, rerender } = renderHook(
      ({ changes }: { changes: CctChange[] }) => {
        const calculation = useCctCalculation(
          laterStartProgrammeDetails,
          changes
        );
        errorsByRender.push(calculation.errors);
        return calculation;
      },
      { initialProps: { changes: [parentalLeave, openLtft] } }
    );
    await waitFor(() =>
      expect(result.current.errors).toEqual([startDateError])
    );

    errorsByRender.length = 0;
    rerender({ changes: [openLtft] });

    expect(errorsByRender.length).toBeGreaterThan(0);
    expect(errorsByRender.flat()).toEqual([]);
    expect(result.current.status).toBe("loading");
    expect(result.current.result?.cctDate).toBe("2031-07-29");
  });
});
