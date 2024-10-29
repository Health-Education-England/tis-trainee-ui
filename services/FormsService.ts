import { AxiosRequestConfig, AxiosResponse } from "axios";
import ApiService from "./apiService";
import { FormRPartA } from "../models/FormRPartA";
import { FormRPartB } from "../models/FormRPartB";
import { FeatureFlags } from "../models/FeatureFlags";
import { IFormR } from "../models/IFormR";
import { ProgrammeMembership } from "../models/ProgrammeMembership";
import store from "../redux/store/store";
import { FileUtilities } from "../utilities/FileUtilities";

export class FormsService extends ApiService {
  constructor() {
    super("/api/forms");
  }

  async downloadTraineeCojPdf(programmeMembershipId: string) {
    const programmeMemberships =
      store.getState().traineeProfile.traineeProfileData.programmeMemberships;

    const programmeMembership = programmeMemberships.find(
      prog => prog.tisId === programmeMembershipId
    );

    let requestConfig: AxiosRequestConfig<ProgrammeMembership> = {
      headers: {
        Accept: "application/pdf"
      },
      responseType: "blob"
    };

    const response = this.axiosInstance.put<
      ProgrammeMembership,
      AxiosResponse<Blob>
    >("/coj", programmeMembership, requestConfig);

    FileUtilities.downloadPdf(
      `conditions-of-joining_${programmeMembershipId}.pdf`,
      () => response
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
}
