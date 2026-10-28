import ApiService from "./apiService";
import {
  CctCalculateResponse,
  CctCalculation,
  CctChangeDto,
  CctProgrammeDetails,
  CctSpecialty
} from "../models/CctTypes";

export type CctCalculateRequest = {
  programmeDetails: CctProgrammeDetails;
  changes: CctChangeDto[];
};

export type CctCalculationSaveRequest = CctCalculateRequest & {
  name: string;
};

export class CctService extends ApiService {
  constructor() {
    super("/api/trainee");
  }

  async calculate(request: CctCalculateRequest): Promise<CctCalculateResponse> {
    const { data } = await this.post<CctCalculateResponse, CctCalculateRequest>(
      "/cct/calculate",
      request
    );
    return data;
  }

  async getSpecialties(): Promise<CctSpecialty[]> {
    const { data } = await this.get<CctSpecialty[]>("/cct/specialties");
    return data;
  }

  async saveCalculation(
    request: CctCalculationSaveRequest
  ): Promise<CctCalculation> {
    const { data } = await this.post<CctCalculation, CctCalculationSaveRequest>(
      "/cct/calculation",
      request
    );
    return data;
  }
}
