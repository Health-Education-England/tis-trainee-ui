import { AxiosResponse } from "axios";
import ApiService from "./apiService";
import { FormRPartA } from "../models/FormRPartA";
import { FormRPartB } from "../models/FormRPartB";

export class FormsService extends ApiService {
  constructor() {
    super("/forms/api");
  }

  async saveTraineeFormRPartA(
    formData: FormRPartA
  ): Promise<AxiosResponse<FormRPartA>> {
    return this.post<FormRPartA>("/formr-parta", formData);
  }

  async updateTraineeFormRPartA(
    formData: FormRPartA
  ): Promise<AxiosResponse<FormRPartA>> {
    return this.put<FormRPartA>("/formr-parta", formData);
  }

  async getTraineeFormRPartAList(): Promise<AxiosResponse<FormRPartA[]>> {
    return this.get<FormRPartA[]>(`/formr-partas/${this.traineeTisId}`);
  }

  async getTraineeFormRPartAByFormId(
    id: string
  ): Promise<AxiosResponse<FormRPartA>> {
    return this.get<FormRPartA>(`/formr-parta/${id}`);
  }
  async saveTraineeFormRPartB(
    formData: FormRPartB
  ): Promise<AxiosResponse<FormRPartB>> {
    return this.post<FormRPartB>("/formr-partb", formData);
  }

  async getTraineeFormRPartBList(): Promise<AxiosResponse<FormRPartB[]>> {
    return this.get<FormRPartB[]>(`/formr-partb/${this.traineeTisId}`);
  }
}
