import { AxiosRequestConfig, AxiosResponse } from "axios";
import ApiService from "./apiService";
import { FormRPartA } from "../models/FormRPartA";
import { FormRPartB } from "../models/FormRPartB";
import { FeatureFlags } from "../models/FeatureFlags";
import { IFormR } from "../models/IFormR";
import { ProgrammeMembership } from "../models/ProgrammeMembership";
import { LtftSummaryObj } from "../redux/slices/ltftSummaryListSlice";
import { LtftDto } from "../utilities/ltftUtilities";
import { ReasonMsgObj } from "../components/common/ActionModal";
export class FormsService extends ApiService {
  constructor() {
    super("/api/forms");
  }

  async downloadTraineeCojPdf(programmeMembership: ProgrammeMembership) {
    let requestConfig: AxiosRequestConfig<ProgrammeMembership> = {
      headers: {
        Accept: "application/pdf"
      },
      responseType: "blob"
    };
    return this.axiosInstance.put<ProgrammeMembership, AxiosResponse<Blob>>(
      "/coj",
      programmeMembership,
      requestConfig
    );
  }

  async downloadTraineeLtftPdf(id: string) {
    const requestConfig: AxiosRequestConfig = {
      headers: {
        Accept: "application/pdf"
      },
      responseType: "blob"
    };
    return this.axiosInstance.get<Blob, AxiosResponse<Blob>>(
      "/ltft/" + id,
      requestConfig
    );
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

  async getTraineeFormRPartAList(): Promise<AxiosResponse<IFormR[]>> {
    return this.get<IFormR[]>("/formr-partas");
  }

  async getTraineeFormRPartAByFormId(
    id: string
  ): Promise<AxiosResponse<FormRPartA>> {
    return this.get<FormRPartA>(`/formr-parta/${id}`);
  }
  async saveTraineeFormRPartB(
    formData: FormRPartB
  ): Promise<AxiosResponse<FormRPartB>> {
    const { isDeclarationAccepted, isConsentAccepted, ...newFormData } =
      formData;
    return this.post<FormRPartB>("/formr-partb", newFormData);
  }

  async getTraineeFormRPartBList(): Promise<AxiosResponse<IFormR[]>> {
    return this.get<IFormR[]>("/formr-partbs");
  }

  async getTraineeFormRPartBByFormId(
    id: string
  ): Promise<AxiosResponse<FormRPartB>> {
    return this.get<FormRPartB>(`/formr-partb/${id}`);
  }

  async updateTraineeFormRPartB(
    formData: FormRPartB
  ): Promise<AxiosResponse<FormRPartB>> {
    const { isDeclarationAccepted, isConsentAccepted, ...newFormData } =
      formData;
    return this.put<FormRPartB>("/formr-partb", newFormData);
  }

  async deleteTraineeFormRPartA(id: string): Promise<AxiosResponse> {
    return this.delete(`/formr-parta/${id}`);
  }

  async deleteTraineeFormRPartB(id: string): Promise<AxiosResponse> {
    return this.delete(`/formr-partb/${id}`);
  }

  async getFeatureFlags(): Promise<AxiosResponse<FeatureFlags>> {
    return this.get<FeatureFlags>("/feature-flags");
  }

  async getLtftSummaryList(): Promise<AxiosResponse<LtftSummaryObj[]>> {
    return this.get<LtftSummaryObj[]>("/ltft");
  }

  async saveLtft(mappedFormData: LtftDto): Promise<AxiosResponse<LtftDto>> {
    return this.post<LtftDto>("/ltft", mappedFormData);
  }

  async updateLtft(mappedFormData: LtftDto): Promise<AxiosResponse<LtftDto>> {
    return this.put<LtftDto>(`/ltft/${mappedFormData.id}`, mappedFormData);
  }

  async deleteLtft(formId: string): Promise<AxiosResponse> {
    return this.delete(`/ltft/${formId}`);
  }

  async getLtftFormById(id: string): Promise<AxiosResponse<LtftDto>> {
    return this.get<LtftDto>(`/ltft/${id}`);
  }

  async submitLtft(mappedFormData: LtftDto): Promise<AxiosResponse<LtftDto>> {
    return this.put<LtftDto>(
      `/ltft/${mappedFormData.id}/submit`,
      mappedFormData
    );
  }

  async unsubmitLtft(
    id: string,
    reason: ReasonMsgObj
  ): Promise<AxiosResponse<LtftDto>> {
    return this.put<LtftDto, ReasonMsgObj>(`/ltft/${id}/unsubmit`, reason);
  }

  async withdrawLtft(
    id: string,
    reason: ReasonMsgObj
  ): Promise<AxiosResponse<LtftDto>> {
    return this.put<LtftDto, ReasonMsgObj>(`/ltft/${id}/withdraw`, reason);
  }
}
