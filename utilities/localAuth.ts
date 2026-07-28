const DEFAULT_LOCAL_AUTH_TOKEN_ENDPOINT = "/local-user/token";

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
  process.env.NEXT_PUBLIC_LOCAL_AUTH_BYPASS_ENABLED?.toLowerCase() === "true";

export const getLocalAuthTokenEndpoint = (): string =>
  process.env.NEXT_PUBLIC_LOCAL_AUTH_TOKEN_ENDPOINT ?? DEFAULT_LOCAL_AUTH_TOKEN_ENDPOINT;

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

  const rawToken = (await response.json().then(data => data.token)).trim();

  if (!rawToken) {
    throw new Error("Local auth token response was empty.");
  }

  if (rawToken.startsWith('"') && rawToken.endsWith('"')) {
    return rawToken.slice(1, -1);
  }

  return rawToken;
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
