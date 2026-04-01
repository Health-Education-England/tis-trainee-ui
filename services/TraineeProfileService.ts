import ApiService, { ApiRequestConfig, ApiResponse } from "./apiService";
import { TraineeProfile } from "../models/TraineeProfile";
import { ProgrammeMembership } from "../models/ProgrammeMembership";
import {
  PersonalDetails,
  initialPersonalDetails
} from "../models/PersonalDetails";
import { CctCalculation } from "../redux/slices/cctSlice";

export class TraineeProfileService extends ApiService {
  constructor() {
    super("/api/trainee");
  }

  async getTraineeProfile(): Promise<ApiResponse<TraineeProfile>> {
    return this.get<TraineeProfile>("/profile");
  }

  async signCoj(
    programmeMembershipId: string
  ): Promise<ApiResponse<ProgrammeMembership>> {
    return this.post<ProgrammeMembership>(
      `/programme-membership/${programmeMembershipId}/sign-coj`
    );
  }

  async getPmConfirmation(
    programmeMembershipId: string
  ): Promise<ApiResponse<Blob>> {
    const requestConfig: ApiRequestConfig = {
      headers: {
        Accept: "application/pdf"
      },
      responseType: "blob"
    };

    return this.get<Blob>(
      `/programme-membership/${programmeMembershipId}/confirmation`,
      requestConfig
    );
  }

  async updateGmc(gmcNumber: string): Promise<ApiResponse<PersonalDetails>> {
    let gmcDetails = { ...initialPersonalDetails, ...{ gmcNumber: gmcNumber } };
    return this.put<PersonalDetails>("/basic-details/gmc-number", gmcDetails);
  }

  async getCctCalculations(): Promise<ApiResponse<CctCalculation[]>> {
    return this.get("/cct/calculation");
  }

  async getCctCalculation(cctId: string): Promise<ApiResponse<CctCalculation>> {
    return this.get<CctCalculation>(`/cct/calculation/${cctId}`);
  }

  async saveCctCalculation(
    cctCalc: CctCalculation
  ): Promise<ApiResponse<CctCalculation>> {
    return this.post<CctCalculation>("/cct/calculation", cctCalc);
  }

  async updateCctCalculation(
    cctCalc: CctCalculation
  ): Promise<ApiResponse<CctCalculation>> {
    return this.put<CctCalculation>(`/cct/calculation/${cctCalc.id}`, cctCalc);
  }

  async deleteCctCalculation(cctId: string): Promise<ApiResponse> {
    return this.delete(`/cct/calculation/${cctId}`);
  }
}
