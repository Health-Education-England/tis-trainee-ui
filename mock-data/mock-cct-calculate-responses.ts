import { CctCalculateResponse } from "../models/CctTypes";

export const mockCctCalculateResponses: Record<string, CctCalculateResponse> = {
  "2023-08-02": {
    changes: [],
    result: {
      cctDate: "2030-07-29",
      originalProgrammeEndDate: "2030-07-29",
      adjustedProgrammeEndDate: "2030-07-29",
      totalWteMonthsCompleted: 0,
      monthsRemaining: 84,
      assumedFullTimePeriods: [],
      projection: {
        startDate: "2023-08-02",
        wte: 1,
        calendarMonths: 84,
        wteMonths: 84
      }
    }
  },
  "2023-08-02 + PARENTAL 2024-02-01 2024-08-01 null false": {
    changes: [
      {
        type: "PARENTAL",
        startDate: "2024-02-01",
        endDate: "2024-08-01",
        wte: null,
        countsTowardsCompletion: false,
        notes: "",
        calendarMonths: 6.016438356164383,
        wteMonths: 0
      }
    ],
    result: {
      cctDate: "2031-01-28",
      originalProgrammeEndDate: "2030-07-29",
      adjustedProgrammeEndDate: "2030-07-29",
      totalWteMonthsCompleted: 6.016438356164383,
      monthsRemaining: 77.98,
      assumedFullTimePeriods: [
        {
          startDate: "2023-08-02",
          endDate: "2024-01-31",
          months: 6.016438356164383
        }
      ],
      projection: {
        startDate: "2024-08-02",
        wte: 1,
        calendarMonths: 77.98,
        wteMonths: 77.98
      }
    }
  },
  "2023-08-02 + LTFT 2025-02-01 null 0.6 true": {
    changes: [
      {
        type: "LTFT",
        startDate: "2025-02-01",
        endDate: null,
        wte: 0.6,
        countsTowardsCompletion: true,
        notes: "",
        calendarMonths: null,
        wteMonths: null
      }
    ],
    result: {
      cctDate: "2034-03-27",
      originalProgrammeEndDate: "2030-07-29",
      adjustedProgrammeEndDate: "2030-07-29",
      totalWteMonthsCompleted: 18.04931506849315,
      monthsRemaining: 65.95,
      assumedFullTimePeriods: [
        {
          startDate: "2023-08-02",
          endDate: "2025-01-31",
          months: 18.04931506849315
        }
      ],
      projection: {
        startDate: "2025-02-01",
        wte: 0.6,
        calendarMonths: 109.91666666666667,
        wteMonths: 65.95
      }
    }
  },
  "2023-08-02 + LTFT 2025-02-01 2025-08-01 0.6 true": {
    changes: [
      {
        type: "LTFT",
        startDate: "2025-02-01",
        endDate: "2025-08-01",
        wte: 0.6,
        countsTowardsCompletion: true,
        notes: "",
        calendarMonths: 5.983561643835616,
        wteMonths: 3.5901369863013692
      }
    ],
    result: {
      cctDate: "2030-10-10",
      originalProgrammeEndDate: "2030-07-29",
      adjustedProgrammeEndDate: "2030-07-29",
      totalWteMonthsCompleted: 21.63945205479452,
      monthsRemaining: 62.36,
      assumedFullTimePeriods: [
        {
          startDate: "2023-08-02",
          endDate: "2025-01-31",
          months: 18.04931506849315
        }
      ],
      projection: {
        startDate: "2025-08-02",
        wte: 1,
        calendarMonths: 62.36,
        wteMonths: 62.36
      }
    }
  },
  "2023-08-02 + LTFT 2024-02-01 2024-08-01 0.6 true": {
    changes: [
      {
        type: "LTFT",
        startDate: "2024-02-01",
        endDate: "2024-08-01",
        wte: 0.6,
        countsTowardsCompletion: true,
        notes: "",
        calendarMonths: 6.016438356164383,
        wteMonths: 3.6098630136986296
      }
    ],
    result: {
      cctDate: "2030-10-10",
      originalProgrammeEndDate: "2030-07-29",
      adjustedProgrammeEndDate: "2030-07-29",
      totalWteMonthsCompleted: 9.626301369863013,
      monthsRemaining: 74.37,
      assumedFullTimePeriods: [
        {
          startDate: "2023-08-02",
          endDate: "2024-01-31",
          months: 6.016438356164383
        }
      ],
      projection: {
        startDate: "2024-08-02",
        wte: 1,
        calendarMonths: 74.37,
        wteMonths: 74.37
      }
    }
  },
  "2023-08-02 + OOPR 2024-02-01 2024-08-01 null false": {
    changes: [
      {
        type: "OOPR",
        startDate: "2024-02-01",
        endDate: "2024-08-01",
        wte: null,
        countsTowardsCompletion: false,
        notes: "",
        calendarMonths: 6.016438356164383,
        wteMonths: 0
      }
    ],
    result: {
      cctDate: "2031-01-28",
      originalProgrammeEndDate: "2030-07-29",
      adjustedProgrammeEndDate: "2030-07-29",
      totalWteMonthsCompleted: 6.016438356164383,
      monthsRemaining: 77.98,
      assumedFullTimePeriods: [
        {
          startDate: "2023-08-02",
          endDate: "2024-01-31",
          months: 6.016438356164383
        }
      ],
      projection: {
        startDate: "2024-08-02",
        wte: 1,
        calendarMonths: 77.98,
        wteMonths: 77.98
      }
    }
  },
  "2023-08-02 + LTFT 2030-01-01 2032-12-31 0.5 true": {
    changes: [
      {
        type: "LTFT",
        startDate: "2030-01-01",
        endDate: "2032-12-31",
        wte: 0.5,
        countsTowardsCompletion: true,
        notes: "",
        calendarMonths: 36.032876712328765,
        wteMonths: 18.016438356164382
      }
    ],
    result: {
      cctDate: "2031-02-26",
      originalProgrammeEndDate: "2030-07-29",
      adjustedProgrammeEndDate: "2030-07-29",
      totalWteMonthsCompleted: 95.07945205479452,
      monthsRemaining: -11.08,
      assumedFullTimePeriods: [
        {
          startDate: "2023-08-02",
          endDate: "2029-12-31",
          months: 77.06301369863013
        }
      ],
      projection: {
        startDate: "2033-01-01",
        wte: 1,
        calendarMonths: -11.08,
        wteMonths: -11.08
      }
    }
  },
  "2023-08-02 + LTFT 2030-01-01 2031-02-26 0.5 true": {
    changes: [
      {
        type: "LTFT",
        startDate: "2030-01-01",
        endDate: "2031-02-26",
        wte: 0.5,
        countsTowardsCompletion: true,
        notes: "",
        calendarMonths: 13.873972602739725,
        wteMonths: 6.9369863013698625
      }
    ],
    result: {
      cctDate: "2031-02-26",
      originalProgrammeEndDate: "2030-07-29",
      adjustedProgrammeEndDate: "2030-07-29",
      totalWteMonthsCompleted: 83.99999999999999,
      monthsRemaining: 0,
      assumedFullTimePeriods: [
        {
          startDate: "2023-08-02",
          endDate: "2029-12-31",
          months: 77.06301369863013
        }
      ],
      projection: {
        startDate: "2031-02-27",
        wte: 1,
        calendarMonths: 0,
        wteMonths: 0
      }
    }
  },
  "2024-03-01": {
    changes: [],
    result: {
      cctDate: "2031-02-26",
      originalProgrammeEndDate: "2031-02-26",
      adjustedProgrammeEndDate: "2031-02-26",
      totalWteMonthsCompleted: 0,
      monthsRemaining: 84,
      assumedFullTimePeriods: [],
      projection: {
        startDate: "2024-03-01",
        wte: 1,
        calendarMonths: 84,
        wteMonths: 84
      }
    }
  },
  "2024-03-01 + PARENTAL 2024-02-01 2024-08-01 null false": {
    changes: [
      {
        type: "PARENTAL",
        startDate: "2024-02-01",
        endDate: "2024-08-01",
        wte: null,
        countsTowardsCompletion: false,
        notes: "",
        calendarMonths: 6.016438356164383,
        wteMonths: 0
      }
    ],
    result: {
      cctDate: "2031-07-30",
      originalProgrammeEndDate: "2031-02-26",
      adjustedProgrammeEndDate: "2031-02-26",
      totalWteMonthsCompleted: 0,
      monthsRemaining: 84,
      assumedFullTimePeriods: [],
      projection: {
        startDate: "2024-08-02",
        wte: 1,
        calendarMonths: 84,
        wteMonths: 84
      }
    }
  }
};
