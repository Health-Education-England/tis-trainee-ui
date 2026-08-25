const configure = jest.fn();
const setKeyValueStorage = jest.fn();
const sessionStorageMock = { isSessionStorage: true };

jest.mock("aws-amplify", () => ({
  Amplify: { configure }
}));

jest.mock("aws-amplify/auth/cognito", () => ({
  cognitoUserPoolsTokenProvider: { setKeyValueStorage }
}));

jest.mock("aws-amplify/utils", () => ({
  I18n: { putVocabularies: jest.fn() },
  sessionStorage: sessionStorageMock
}));

jest.mock("../../aws-amplify/config", () => ({
  USER_POOL_ID: "user-pool-id",
  APP_CLIENT_ID: "app-client-id",
  IDENTITY_POOL_ID: "identity-pool-id"
}));

describe("_app", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    jest.isolateModules(() => {
      require("../_app");
    });
  });

  it("should override Amplify default and store auth tokens in sessionStorage", () => {
    expect(setKeyValueStorage).toHaveBeenCalledWith(sessionStorageMock);
  });

  it("should configure token storage after Amplify.configure so it is not overridden", () => {
    const configureOrder = configure.mock.invocationCallOrder[0];
    const setKeyValueStorageOrder =
      setKeyValueStorage.mock.invocationCallOrder[0];

    expect(configureOrder).toBeLessThan(setKeyValueStorageOrder);
  });
});
