import { AxiosResponse } from "axios";
import ApiService from "./apiService";
import { TraineeProfile } from "../models/TraineeProfile";
import { ProgrammeMembership } from "../models/ProgrammeMembership";

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
}
