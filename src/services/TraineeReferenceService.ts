import ApiService from "./apiService";
import { AxiosResponse } from "axios";
import { CombinedReferenceData } from "../models/CombinedReferenceData";
export class TraineeReferenceService extends ApiService {
  constructor() {
    super("/api/reference");
  }

  getGenders(): Promise<AxiosResponse<any>> {
    return this.get("/gender");
  }

  getQualifications(): Promise<AxiosResponse<any>> {
    return this.get("/qualification");
  }

  getColleges(): Promise<AxiosResponse<any>> {
    return this.get("/college");
  }

  getDesignatedBodies(): Promise<AxiosResponse<any>> {
    return this.get("/dbc");
  }

  getLocalOffices(): Promise<AxiosResponse<any>> {
    return this.get("/local-office");
  }

  getTrainingGrades(): Promise<AxiosResponse<any>> {
    return this.get("/grade");
  }

  getImmigrationStatus(): Promise<AxiosResponse<any>> {
    return this.get("/immigration-status");
  }

  getCurricula(): Promise<AxiosResponse<any>> {
    return this.get("/curriculum");
  }

  getDeclarationType(): Promise<AxiosResponse<any>> {
    return this.get("/declaration-type");
  }

  getCovidChangeCircs(): Promise<AxiosResponse<any>> {
    return this.get("/covid-change-circs");
  }

  getCombinedReferenceData(): Promise<CombinedReferenceData> {
    return Promise.all([
      this.get("/gender").then(response => response.data),
      this.get("/college").then(response => response.data),
      this.get("/dbc").then(response => response.data),
      this.get("/local-office").then(response => response.data),
      this.get("/grade").then(response => response.data),
      this.get("/immigration-status").then(response => response.data),
      this.get("/curriculum").then(response => response.data),
      this.get("/declaration-type").then(response => response.data),
      this.get("/covid-change-circs").then(response => response.data)
    ]).then(
      ([
        gender,
        college,
        dbc,
        localOffice,
        grade,
        immigrationStatus,
        curriculum,
        declarationType,
        covidChangeCircs
      ]) => ({
        gender,
        college,
        dbc,
        localOffice,
        grade,
        immigrationStatus,
        curriculum,
        declarationType,
        covidChangeCircs
      })
    );
  }
}
