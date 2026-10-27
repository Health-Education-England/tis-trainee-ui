import ApiService from "./apiService";
import {
  CctCalculateResponse,
  CctCalculation,
  CctSpecialty
} from "../models/CctTypes";

export type CctCalculateRequest = Pick<
  CctCalculation,
  "programmeDetails" | "changes"
>;

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
}
