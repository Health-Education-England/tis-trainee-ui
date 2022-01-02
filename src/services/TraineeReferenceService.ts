import ApiService from "./apiService";
import { AxiosResponse } from "axios";

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

  getCombinedReference() {
    const res: any = Promise.all([
      this.get("/gender"),
      this.get("/college"),
      this.get("/dbc"),
      this.get("/local-office"),
      this.get("/grade"),
      this.get("/immigration-status"),
      this.get("/curriculum"),
      this.get("/declaration-type"),
      this.get("/covid-change-circs")
    ]);
    return res;
  }
}
