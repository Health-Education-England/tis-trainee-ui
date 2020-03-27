import { AxiosResponse } from "axios";
import ApiService from "./apiService";
import { FormRPartA } from "../models/FormRPartA";

export class FormRPartAService {
  private apiService: ApiService;

  constructor() {
    this.apiService = new ApiService();
  }

  async saveTraineeFormRPartA(
    formData: FormRPartA
  ): Promise<AxiosResponse<FormRPartA>> {
    return this.apiService.post<FormRPartA>(
      "http://localhost:8207/api/formr-parta",
      formData
    );
  }

  async getTraineeFormRPartA(): Promise<AxiosResponse<FormRPartA[]>> {
    return this.apiService.get<FormRPartA[]>(
      "http://localhost:8207/api/formr-parta/123"
    );
  }
}
