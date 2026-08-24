import ApiService, { ApiRequestConfig, ApiResponse } from "./apiService";
import { TraineeProfile } from "../models/TraineeProfile";
import { ProgrammeMembership } from "../models/ProgrammeMembership";
import {
  PersonalDetails,
  initialPersonalDetails
} from "../models/PersonalDetails";

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
    let gmcDetails = { ...initialPersonalDetails, gmcNumber };
    return this.put<PersonalDetails>("/basic-details/gmc-number", gmcDetails);
  }

  async updateEmail(email: string): Promise<ApiResponse<void>> {
    let emailDetails = { ...initialPersonalDetails, email };
    return this.put<void>("/basic-details/email-address", emailDetails);
  }
}
