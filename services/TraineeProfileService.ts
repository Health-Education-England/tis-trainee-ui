import { AxiosResponse, AxiosRequestConfig } from "axios";
import ApiService from "./apiService";
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

  async getTraineeProfile(): Promise<AxiosResponse<TraineeProfile>> {
    return this.get<TraineeProfile>("/profile");
  }

  async signCoj(
    programmeMembershipId: string
  ): Promise<AxiosResponse<ProgrammeMembership>> {
    return this.post<ProgrammeMembership>(
      `/programme-membership/${programmeMembershipId}/sign-coj`
    );
  }

  async getPmConfirmation(
    programmeMembershipId: string
  ): Promise<AxiosResponse<Blob>> {
    let requestConfig: AxiosRequestConfig<string> = {
      headers: {
        Accept: "application/pdf"
      },
      responseType: "blob"
    };

    return this.axiosInstance.get<Blob>(
      `/programme-membership/${programmeMembershipId}/confirmation`,
      requestConfig
    );
  }

  async updateGmc(gmcNumber: string): Promise<AxiosResponse<PersonalDetails>> {
    let gmcDetails = { ...initialPersonalDetails, ...{ gmcNumber: gmcNumber } };
    return this.put<PersonalDetails>("/basic-details/gmc-number", gmcDetails);
  }
}
