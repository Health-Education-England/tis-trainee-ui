import { AxiosResponse } from "axios";
import { Placement } from "../models/Placement";
import { ProgrammeMembership } from "../models/ProgrammeMembership";
import ApiService from "./apiService";

export class CredentialsService extends ApiService {
  constructor() {
    super("credentials/api");
  }

  // WIP need to work with FS'ers on this stuff!
  async issueDspCredential(
    name: string,
    iData: ProgrammeMembership | Placement | null,
    iState?: any
  ): Promise<AxiosResponse<any>> {
    name === "programme" ? "programme-membership" : name;
    return this.post(`/issue/${name}`, iData, { params: iState });
  }
}
