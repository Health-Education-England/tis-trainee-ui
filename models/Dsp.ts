export interface Signature {
  hmac: string | null;
  signedAt: Date | string | null;
  validUntil: Date | string | null;
}

export type CredentialDspType = "programme" | "placement";

export type CredentialDsp = {
  credentialId: string;
  traineeId: string;
  credentialType: string;
  tisId: string;
  issuedAt: Date;
  revokedAt?: Date;
};
