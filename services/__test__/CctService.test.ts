import { CctService, isCctCalculateStubEnabled } from "../CctService";
import { CctCalculateRequest } from "../CctService";

const request: CctCalculateRequest = {
  programmeDetails: {
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
  },
  changes: [],
  projection: { startDate: "2023-08-02", wte: 1 }
};

describe("CctService", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("isCctCalculateStubEnabled", () => {
    it("is off unless the environment is local and the flag is set", () => {
      process.env.NEXT_PUBLIC_ENVIRONMENT_NAME = "preprod";
      process.env.NEXT_PUBLIC_CCT_CALCULATE_STUB_ENABLED = "true";
      expect(isCctCalculateStubEnabled()).toBe(false);

      process.env.NEXT_PUBLIC_ENVIRONMENT_NAME = "local";
      delete process.env.NEXT_PUBLIC_CCT_CALCULATE_STUB_ENABLED;
      expect(isCctCalculateStubEnabled()).toBe(false);

      process.env.NEXT_PUBLIC_CCT_CALCULATE_STUB_ENABLED = "TRUE";
      expect(isCctCalculateStubEnabled()).toBe(true);
    });
  });

  describe("calculate", () => {
    it("returns a stubbed result without a request when the stub is enabled", async () => {
      process.env.NEXT_PUBLIC_ENVIRONMENT_NAME = "local";
      process.env.NEXT_PUBLIC_CCT_CALCULATE_STUB_ENABLED = "true";
      const fetchMock = jest.fn();
      Object.defineProperty(globalThis, "fetch", {
        configurable: true,
        writable: true,
        value: fetchMock
      });

      const result = await new CctService().calculate(request);

      expect(fetchMock).not.toHaveBeenCalled();
      expect(result.cctDate).toBe("2031-07-29");
      expect(result.monthsRemaining).toBe(96);
      Reflect.deleteProperty(globalThis, "fetch");
    });
  });
});
