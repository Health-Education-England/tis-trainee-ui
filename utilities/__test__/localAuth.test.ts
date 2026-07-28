import {
  decodeJwtPayload,
  fetchLocalAuthToken,
  getLocalAuthTokenEndpoint,
  isLocalAuthBypassEnabled
} from "../localAuth";

describe("localAuth utilities", () => {
  let originalFetch: typeof globalThis.fetch;
  const originalEnv = process.env;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;

    if (originalFetch === undefined) {
      Reflect.deleteProperty(globalThis, "fetch");
      return;
    }

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

  it("should return true when local auth bypass env is true", () => {
    process.env.NEXT_PUBLIC_LOCAL_AUTH_BYPASS_ENABLED = "TRUE";
    expect(isLocalAuthBypassEnabled()).toBe(true);
  });

  it("should resolve configured local auth endpoint", () => {
    process.env.NEXT_PUBLIC_LOCAL_AUTH_TOKEN_ENDPOINT = "/custom/token";
    expect(getLocalAuthTokenEndpoint()).toBe("/custom/token");
  });

  it("should fetch and trim local auth token", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: jest.fn().mockResolvedValue(" token-123 ")
    } as unknown as Response);

    Object.defineProperty(globalThis, "fetch", {
      value: fetchMock,
      writable: true,
      configurable: true
    });

    await expect(fetchLocalAuthToken()).resolves.toBe("token-123");
    expect(fetchMock).toHaveBeenCalledWith(
      "/local-user/token",
      expect.objectContaining({
        method: "GET"
      })
    );
  });

  it("should throw on failed local auth token response", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: jest.fn()
    } as unknown as Response);

    Object.defineProperty(globalThis, "fetch", {
      value: fetchMock,
      writable: true,
      configurable: true
    });

    await expect(fetchLocalAuthToken()).rejects.toThrow(
      "Local auth token request failed with status 500."
    );
  });

  it("should decode JWT payload", () => {
    const payload = { sub: "abc", features: { actions: { enabled: true } } };
    const encodedPayload = btoa(JSON.stringify(payload))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
    const token = `header.${encodedPayload}.signature`;

    expect(decodeJwtPayload<typeof payload>(token)).toEqual(payload);
  });
});
