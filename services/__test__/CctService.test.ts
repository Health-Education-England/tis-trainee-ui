import {
  CctCalculateResponse,
  CctCalculation,
  CctResult,
  CctSpecialty
} from "../../models/CctTypes";
import { ApiResponse } from "../apiService";
import { CctService } from "../CctService";
import { CctCalculateRequest, CctCalculationSaveRequest } from "../CctService";

const request: CctCalculateRequest = {
  programmeDetails: {
    specialty: "Paediatrics",
    startDate: "2023-08-02",
    lengthMonths: 96,
    lengthOverrideNotes: "",
    startGrade: "ST1",
    startGradeOverrideNotes: "",
    additionalTrainingTime: [],
    acceleratedTrainingTime: [],
    eighteenMonthFinalGrade: null,
    eighteenMonthFinalGradeNotes: "",
    skippedGrade: null,
    skippedGradeNotes: ""
  },
  changes: []
};

const result: CctResult = {
  cctDate: "2031-07-29",
  originalProgrammeEndDate: "2031-07-29",
  adjustedProgrammeEndDate: "2031-07-29",
  totalCalendarMonthsCompleted: 0,
  totalWteMonthsCompleted: 0,
  monthsRemaining: 96,
  assumedFullTimePeriods: [],
  projection: {
    startDate: "2023-08-02",
    wte: 1,
    calendarMonths: 96,
    wteMonths: 96
  },
  gradeProgression: []
};

const saveRequest: CctCalculationSaveRequest = {
  ...request,
  name: "My calculation"
};

const calculation: CctCalculation = {
  id: "calc-1",
  name: "My calculation",
  programmeDetails: request.programmeDetails,
  changes: [],
  result,
  created: "2026-11-24T10:00:00Z",
  lastModified: "2026-11-24T10:00:00Z"
};

const okResponse = <T>(data: T): ApiResponse<T> => ({
  data,
  status: 200,
  statusText: "OK",
  headers: {},
  config: {}
});

describe("CctService", () => {
  describe("calculate", () => {
    it("posts the request to the BE and returns its result", async () => {
      const body: CctCalculateResponse = {
        changes: [],
        result,
        errors: []
      };
      const service = new CctService();
      jest.spyOn(service, "post").mockResolvedValue(okResponse(body));

      const response = await service.calculate(request);

      expect(service.post).toHaveBeenCalledWith("/cct/calculate", request);
      expect(response).toEqual(body);
    });
  });

  describe("getSpecialties", () => {
    it("gets the list from the BE", async () => {
      const specialties: CctSpecialty[] = [
        {
          name: "Paediatrics",
          lengthMonths: 84,
          entryGrade: "ST1",
          eighteenMonthFinalYear: false
        }
      ];
      const service = new CctService();
      jest.spyOn(service, "get").mockResolvedValue(okResponse(specialties));

      const response = await service.getSpecialties();

      expect(service.get).toHaveBeenCalledWith("/cct/specialties");
      expect(response).toEqual(specialties);
    });
  });

  describe("saveCalculation", () => {
    it("posts the calculation to the BE and returns the saved one", async () => {
      const service = new CctService();
      jest.spyOn(service, "post").mockResolvedValue(okResponse(calculation));

      const response = await service.saveCalculation(saveRequest);

      expect(service.post).toHaveBeenCalledWith(
        "/cct/calculation",
        saveRequest
      );
      expect(response).toEqual(calculation);
    });
  });

  describe("getCalculations", () => {
    it("gets the trainee's saved calculations from the BE", async () => {
      const service = new CctService();
      jest.spyOn(service, "get").mockResolvedValue(okResponse([calculation]));

      const response = await service.getCalculations();

      expect(service.get).toHaveBeenCalledWith("/cct/calculation");
      expect(response).toEqual([calculation]);
    });
  });

  describe("getCalculation", () => {
    it("gets one saved calculation from the BE by id", async () => {
      const service = new CctService();
      jest.spyOn(service, "get").mockResolvedValue(okResponse(calculation));

      const response = await service.getCalculation("calc-1");

      expect(service.get).toHaveBeenCalledWith("/cct/calculation/calc-1");
      expect(response).toEqual(calculation);
    });
  });

  describe("updateCalculation", () => {
    it("puts the calculation to the BE by id and returns the saved one", async () => {
      const service = new CctService();
      jest.spyOn(service, "put").mockResolvedValue(okResponse(calculation));

      const response = await service.updateCalculation("calc-1", saveRequest);

      expect(service.put).toHaveBeenCalledWith(
        "/cct/calculation/calc-1",
        saveRequest
      );
      expect(response).toEqual(calculation);
    });
  });

  describe("deleteCalculation", () => {
    it("deletes the calculation from the BE by id", async () => {
      const service = new CctService();
      jest.spyOn(service, "delete").mockResolvedValue(okResponse(undefined));

      await service.deleteCalculation("calc-1");

      expect(service.delete).toHaveBeenCalledWith("/cct/calculation/calc-1");
    });
  });
});
