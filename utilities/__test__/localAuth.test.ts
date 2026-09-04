import {
  createLocalAuthTokenProvider,
  decodeJwtPayload,
  fetchLocalAuthToken,
  getLocalAuthMfaPreference,
  getLocalAuthTokenEndpoint,
  isLocalAuthBypassEnabled
} from "../localAuth";

const buildToken = (payload: Record<string, unknown>) => {
  const encodedPayload = btoa(JSON.stringify(payload))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
  return `header.${encodedPayload}.signature`;
};

const mockFetch = (response: Partial<Response>): jest.Mock => {
  const fetchMock = jest.fn().mockResolvedValue(response as Response);
  Object.defineProperty(globalThis, "fetch", {
    value: fetchMock,
    writable: true,
    configurable: true
  });
  return fetchMock;
};

describe("localAuth utilities", () => {
  const originalFetch = globalThis.fetch;
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    // Git Bash on Windows mangles POSIX-style env var values, so ensure the default endpoint path is used
    delete process.env.NEXT_PUBLIC_LOCAL_AUTH_TOKEN_ENDPOINT;
  });

  afterEach(() => {
    process.env = originalEnv;
    Object.defineProperty(globalThis, "fetch", {
      value: originalFetch,
      writable: true,
      configurable: true
    });
  });

  it("should return false when local auth bypass env is not true", () => {
    delete process.env.NEXT_PUBLIC_LOCAL_AUTH_BYPASS_ENABLED;
    expect(isLocalAuthBypassEnabled()).toBe(false);
  });

  it("should return true when local auth bypass env is true and environment is local", () => {
    process.env.NEXT_PUBLIC_LOCAL_AUTH_BYPASS_ENABLED = "TRUE";
    process.env.NEXT_PUBLIC_ENVIRONMENT_NAME = "local";
    expect(isLocalAuthBypassEnabled()).toBe(true);
  });

  it.each(["production", "stage", "unknown", "", undefined])(
    "should return false when local auth bypass env is true but the environment is %s",
    environmentName => {
      process.env.NEXT_PUBLIC_LOCAL_AUTH_BYPASS_ENABLED = "TRUE";
      process.env.NEXT_PUBLIC_ENVIRONMENT_NAME = environmentName;
      expect(isLocalAuthBypassEnabled()).toBe(false);
    }
  );

  it("should return local auth bypass mfa preference", () => {
    const mfaPreference = getLocalAuthMfaPreference();
    expect(mfaPreference.preferred).toEqual("EMAIL");
    expect(mfaPreference.enabled).toEqual(["EMAIL"]);
  });

  it("should resolve configured local auth endpoint", () => {
    process.env.NEXT_PUBLIC_LOCAL_AUTH_TOKEN_ENDPOINT = "/custom/token";
    expect(getLocalAuthTokenEndpoint()).toBe("/custom/token");
  });

  it("should fetch and trim local auth token", async () => {
    const fetchMock = mockFetch({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ token: " token-123 " })
    } as unknown as Response);

    await expect(fetchLocalAuthToken()).resolves.toBe("token-123");
    expect(fetchMock).toHaveBeenCalledWith(
      "/local-user/token",
      expect.objectContaining({
        method: "GET"
      })
    );
  });

  it("should throw on failed local auth token response", async () => {
    mockFetch({
      ok: false,
      status: 500,
      text: jest.fn()
    } as unknown as Response);

    await expect(fetchLocalAuthToken()).rejects.toThrow(
      "Local auth token request failed with status 500."
    );
  });

  it.each(["", "   ", undefined, null, 123])(
    "should throw on an invalid local auth token value: %s",
    async token => {
      mockFetch({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({ token })
      } as unknown as Response);

      await expect(fetchLocalAuthToken()).rejects.toThrow(
        "Local auth token response was empty."
      );
    }
  );

  it("should decode JWT payload", () => {
    const payload = { sub: "abc", features: { actions: { enabled: true } } };

    expect(decodeJwtPayload<typeof payload>(buildToken(payload))).toEqual(
      payload
    );
  });
});

describe("createLocalAuthTokenProvider", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    Object.defineProperty(globalThis, "fetch", {
      value: originalFetch,
      writable: true,
      configurable: true
    });
  });

  it("should return tokens built from the fetched local auth token", async () => {
    const token = buildToken({ sub: "abc" });
    const fetchMock = mockFetch({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ token })
    } as unknown as Response);

    const provider = createLocalAuthTokenProvider();
    const tokens = await provider.getTokens();

    expect(tokens.idToken?.toString()).toBe(token);
    expect(tokens.idToken?.payload).toEqual({ sub: "abc" });
    expect(tokens.accessToken.toString()).toBe(token);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("should cache the fetched token across calls", async () => {
    const fetchMock = mockFetch({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ token: buildToken({ sub: "abc" }) })
    } as unknown as Response);

    const provider = createLocalAuthTokenProvider();

    await provider.getTokens();
    await provider.getTokens();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("should clear the cache and allow retrying after a failed fetch", async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: jest.fn()
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({ token: buildToken({ sub: "abc" }) })
      } as unknown as Response);
    Object.defineProperty(globalThis, "fetch", {
      value: fetchMock,
      writable: true,
      configurable: true
    });

    const provider = createLocalAuthTokenProvider();

    await expect(provider.getTokens()).rejects.toThrow(
      "Failed to fetch local auth token."
    );

    await expect(provider.getTokens()).resolves.toBeDefined();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
