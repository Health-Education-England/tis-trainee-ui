import ApiService, { ApiResponse } from "./apiService";
import { TraineeAction } from "../models/TraineeAction";

export class TraineeActionsService extends ApiService {
  constructor() {
    super("/api");
  }

  async getIncompleteTraineeActions(): Promise<ApiResponse<TraineeAction[]>> {
    return this.get<TraineeAction[]>(`/actions`);
  }

  async completeTraineeAction(
    actionId: string
  ): Promise<ApiResponse<TraineeAction>> {
    return this.post<TraineeAction>(`/actions/${actionId}/complete`);
  }
}
