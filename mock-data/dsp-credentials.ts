import { CredentialDsp } from "../models/Dsp";

export const mockDspPlacementCredentials: CredentialDsp[] = [
  {
    credentialId: "44",
    traineeId: "3bd3f009-9c7a-4352-bcc6-9dff8eac07d6",
    credentialType: "issue.TrainingPlacement",
    tisId: "99",
    issuedAt: new Date("2023-07-28T17:40:54.000+00:00")
  },
  {
    credentialId: "911850c6-66c7-47ac-b78a-b54688a748b7",
    traineeId: "11111",
    credentialType: "issue.TrainingPlacement",
    tisId: "1",
    issuedAt: new Date("2023-07-28T17:40:54.000+00:00")
  },
  {
    credentialId: "33ccc908-1439-11ee-be56-0242ac120002",
    traineeId: "2222",
    credentialType: "issue.TrainingPlacement",
    tisId: "2",
    issuedAt: new Date("2023-07-28T17:40:54.000+00:00"),
    revokedAt: new Date("2023-08-14T14:12:54.000+00:00")
  }
];
