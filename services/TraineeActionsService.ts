import { AxiosResponse } from "axios";
import ApiService from "./apiService";
import { Action } from "../models/Action";

export class TraineeActionsService extends ApiService {
  constructor() {
    super("/api/actions");
  }

  async getIncompleteTraineeActions(): Promise<AxiosResponse<Action[]>> {
    return this.get<Action[]>(`/action`);
  }

  async completeTraineeAction(
    actionId: string
  ): Promise<AxiosResponse<Action>> {
    return this.post<Action>(`/${actionId}/complete`);
  }
}
