export enum MFAStatus {
  NoMFA = "NOMFA",
  SMS = "SMS_MFA",
  TOTP = "SOFTWARE_TOKEN_MFA"
}

export type MFAType =
  | "TOTP"
  | "SMS"
  | "NOMFA"
  | "SMS_MFA"
  | "SOFTWARE_TOKEN_MFA";
