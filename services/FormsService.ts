import ApiService, { ApiRequestConfig, ApiResponse } from "./apiService";
import { FormRPartA } from "../models/FormRPartA";
import { FormRPartB } from "../models/FormRPartB";
import { FeatureFlags } from "../models/FeatureFlags";
import { IFormR } from "../models/IFormR";
import { ProgrammeMembership } from "../models/ProgrammeMembership";
import { ReasonMsgObj } from "../components/common/ActionModal";
import { LtftDto, LtftSummaryObj } from "../models/LtftTypes";
export class FormsService extends ApiService {
  constructor() {
    super("/api/forms");
  }

  async downloadTraineeCojPdf(programmeMembership: ProgrammeMembership) {
    const requestConfig: ApiRequestConfig = {
      headers: {
        Accept: "application/pdf"
      },
      responseType: "blob"
    };

    return this.put<Blob, ProgrammeMembership>(
      "/coj",
      programmeMembership,
      requestConfig
    );
  }

  async downloadTraineeLtftPdf(id: string): Promise<ApiResponse<Blob>> {
    const requestConfig: ApiRequestConfig = {
      headers: {
        Accept: "application/pdf"
      },
      responseType: "blob"
    };

    return this.get<Blob>("/ltft/" + id, requestConfig);
  }

  async saveTraineeFormRPartA(
    formData: FormRPartA
  ): Promise<ApiResponse<FormRPartA>> {
    return this.post<FormRPartA>("/formr-parta", formData);
  }

  async updateTraineeFormRPartA(
    formData: FormRPartA
  ): Promise<ApiResponse<FormRPartA>> {
    return this.put<FormRPartA>("/formr-parta", formData);
  }

  async getTraineeFormRPartAList(): Promise<ApiResponse<IFormR[]>> {
    return this.get<IFormR[]>("/formr-partas");
  }

  async getTraineeFormRPartAByFormId(
    id: string
  ): Promise<ApiResponse<FormRPartA>> {
    return this.get<FormRPartA>(`/formr-parta/${id}`);
  }
  async saveTraineeFormRPartB(
    formData: FormRPartB
  ): Promise<ApiResponse<FormRPartB>> {
    const { isDeclarationAccepted, isConsentAccepted, ...newFormData } =
      formData;
    return this.post<FormRPartB>("/formr-partb", newFormData);
  }

  async getTraineeFormRPartBList(): Promise<ApiResponse<IFormR[]>> {
    return this.get<IFormR[]>("/formr-partbs");
  }

  async getTraineeFormRPartBByFormId(
    id: string
  ): Promise<ApiResponse<FormRPartB>> {
    return this.get<FormRPartB>(`/formr-partb/${id}`);
  }

  async updateTraineeFormRPartB(
    formData: FormRPartB
  ): Promise<ApiResponse<FormRPartB>> {
    const { isDeclarationAccepted, isConsentAccepted, ...newFormData } =
      formData;
    return this.put<FormRPartB>("/formr-partb", newFormData);
  }

  async deleteTraineeFormRPartA(id: string): Promise<ApiResponse> {
    return this.delete(`/formr-parta/${id}`);
  }

  async deleteTraineeFormRPartB(id: string): Promise<ApiResponse> {
    return this.delete(`/formr-partb/${id}`);
  }

  async getFeatureFlags(): Promise<ApiResponse<FeatureFlags>> {
    return this.get<FeatureFlags>("/feature-flags");
  }

  async getLtftSummaryList(): Promise<ApiResponse<LtftSummaryObj[]>> {
    return this.get<LtftSummaryObj[]>("/ltft");
  }

  async saveLtft(mappedFormData: LtftDto): Promise<ApiResponse<LtftDto>> {
    return this.post<LtftDto>("/ltft", mappedFormData);
  }

  async updateLtft(mappedFormData: LtftDto): Promise<ApiResponse<LtftDto>> {
    return this.put<LtftDto>(`/ltft/${mappedFormData.id}`, mappedFormData);
  }

  async deleteLtft(formId: string): Promise<ApiResponse> {
    return this.delete(`/ltft/${formId}`);
  }

  async getLtftFormById(id: string): Promise<ApiResponse<LtftDto>> {
    return this.get<LtftDto>(`/ltft/${id}`);
  }

  async submitLtft(mappedFormData: LtftDto): Promise<ApiResponse<LtftDto>> {
    return this.put<LtftDto>(
      `/ltft/${mappedFormData.id}/submit`,
      mappedFormData
    );
  }

  async unsubmitLtft(
    id: string,
    reason: ReasonMsgObj
  ): Promise<ApiResponse<LtftDto>> {
    return this.put<LtftDto, ReasonMsgObj>(`/ltft/${id}/unsubmit`, reason);
  }

  async withdrawLtft(
    id: string,
    reason: ReasonMsgObj
  ): Promise<ApiResponse<LtftDto>> {
    return this.put<LtftDto, ReasonMsgObj>(`/ltft/${id}/withdraw`, reason);
  }
}
