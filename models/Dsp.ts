export interface Signature {
  hmac: string | null;
  signedAt: Date | string | null;
  validUntil: Date | string | null;
}
