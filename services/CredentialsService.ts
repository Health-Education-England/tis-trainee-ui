import { AxiosResponse } from "axios";
import { PersonalDetails } from "../models/PersonalDetails";
import { Placement } from "../models/Placement";
import { ProgrammeMembership } from "../models/ProgrammeMembership";
import ApiService from "./apiService";

export class CredentialsService extends ApiService {
  constructor() {
    super("../api/credentials");
  }

  async issueDspCredential(
    name: string,
    iData: ProgrammeMembership | Placement | null,
    iState?: any
  ): Promise<AxiosResponse<any>> {
    const endpoint = name === "programme" ? "programme-membership" : name;
    return this.post(`/issue/${endpoint}`, iData, { params: iState });
  }

  async verifyDspIdentity(
    iData: PersonalDetails| null,
    iState?: any
  ): Promise<AxiosResponse<any>> {
    return this.post(`/verify/identity`, iData, { params: iState });
  }
}
