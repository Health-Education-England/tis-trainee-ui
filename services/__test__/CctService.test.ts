import { CctCalculateResponse, CctSpecialty } from "../../models/CctTypes";
import { ApiResponse } from "../apiService";
import { CctService } from "../CctService";
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
  changes: []
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
        result: {
          cctDate: "2031-07-29",
          originalProgrammeEndDate: "2031-07-29",
          adjustedProgrammeEndDate: "2031-07-29",
          totalWteMonthsCompleted: 0,
          monthsRemaining: 96,
          assumedFullTimePeriods: [],
          projection: {
            startDate: "2023-08-02",
            wte: 1,
            calendarMonths: 96,
            wteMonths: 96
          }
        }
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
        { name: "Paediatrics", lengthMonths: 84, entryGrade: "ST1" }
      ];
      const service = new CctService();
      jest.spyOn(service, "get").mockResolvedValue(okResponse(specialties));

      const response = await service.getSpecialties();

      expect(service.get).toHaveBeenCalledWith("/cct/specialties");
      expect(response).toEqual(specialties);
    });
  });
});
