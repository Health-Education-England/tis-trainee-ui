import { FetchMFAPreferenceOutput } from "aws-amplify/auth/cognito";

const DEFAULT_LOCAL_AUTH_TOKEN_ENDPOINT = "/local-user/token";
const LOCAL_AUTH_MFA_TYPE = "EMAIL";

const decodeBase64 = (encodedValue: string): string => {
  if (typeof atob === "function") {
    return atob(encodedValue);
  }

  if (typeof Buffer !== "undefined") {
    return Buffer.from(encodedValue, "base64").toString("binary");
  }

  throw new Error("No base64 decoder is available in this environment.");
};

const decodeBase64UrlToJson = (encodedValue: string): string => {
  const base64Value = encodedValue.replace(/-/g, "+").replace(/_/g, "/");
  const paddedValue = base64Value.padEnd(
    Math.ceil(base64Value.length / 4) * 4,
    "="
  );
  const binaryValue = decodeBase64(paddedValue);
  const percentEncodedUtf8 = Array.from(binaryValue)
    .map(char => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
    .join("");

  return decodeURIComponent(percentEncodedUtf8);
};

export const isLocalAuthBypassEnabled = (): boolean =>
  process.env.NEXT_PUBLIC_ENVIRONMENT_NAME === "local" &&
  process.env.NEXT_PUBLIC_LOCAL_AUTH_BYPASS_ENABLED?.toLowerCase() === "true";

export const getLocalAuthMfaPreference = (): FetchMFAPreferenceOutput => ({
  preferred: LOCAL_AUTH_MFA_TYPE,
  enabled: [LOCAL_AUTH_MFA_TYPE]
});

export const getLocalAuthTokenEndpoint = (): string =>
  process.env.NEXT_PUBLIC_LOCAL_AUTH_TOKEN_ENDPOINT ??
  DEFAULT_LOCAL_AUTH_TOKEN_ENDPOINT;

export const fetchLocalAuthToken = async (): Promise<string> => {
  const response = await fetch(getLocalAuthTokenEndpoint(), {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(
      `Local auth token request failed with status ${response.status}.`
    );
  }

  const rawToken = await response.json().then(data => data.token);

  if (typeof rawToken !== "string" || !rawToken.trim()) {
    throw new Error("Local auth token response was empty.");
  }

  return rawToken.trim();
};

export const decodeJwtPayload = <TPayload extends Record<string, unknown>>(
  token: string
): TPayload => {
  const tokenSegments = token.split(".");

  if (tokenSegments.length < 2) {
    throw new Error("Invalid JWT token received from local auth endpoint.");
  }

  const decodedPayload = decodeBase64UrlToJson(tokenSegments[1]);
  return JSON.parse(decodedPayload) as TPayload;
};

// Minimal structural copies of the @aws-amplify/core types so this module
// doesn't need a runtime dependency on that package (only Amplify.configure needs the shape to match).
interface LocalJWT {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- matches Amplify's JsonObject-shaped JWT payload
  payload: Record<string, any>;
  toString(): string;
}

interface LocalAuthTokens {
  idToken?: LocalJWT;
  accessToken: LocalJWT;
}

export interface LocalAuthTokenProvider {
  getTokens(): Promise<LocalAuthTokens>;
}

const toJWT = (token: string): LocalJWT => ({
  payload: decodeJwtPayload(token),
  toString: () => token
});

export const createLocalAuthTokenProvider = (): LocalAuthTokenProvider => {
  let cachedTokenPromise: Promise<string> | undefined;

  return {
    getTokens: async () => {
      if (!cachedTokenPromise) {
        cachedTokenPromise = fetchLocalAuthToken().catch(() => {
          cachedTokenPromise = undefined;
          throw new Error("Failed to fetch local auth token.");
        });
      }

      const token = await cachedTokenPromise;
      const jwt = toJWT(token);

      return { idToken: jwt, accessToken: jwt };
    }
  };
};
