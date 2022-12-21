import { CacheUtilities } from "../CacheUtilities";

describe("CacheUtilities", () => {
  describe("semverGreaterThan", () => {
    it("should return true if latest version is greater than the current version ", () => {
      const latestV = "0.2.0";
      const currentV = "0.1.0";
      expect(CacheUtilities.SemverGreaterThan(latestV, currentV)).toEqual(true);
    });

    it("should return false if latest version is the same as the current version ", () => {
      const latestV = "0.1.0";
      const currentV = "0.1.0";
      expect(CacheUtilities.SemverGreaterThan(latestV, currentV)).toEqual(
        false
      );
    });

    it("should return false if latest version is null", () => {
      const latestV = null;
      const currentV = "0.1.0";
      expect(CacheUtilities.SemverGreaterThan(latestV, currentV)).toEqual(
        false
      );
    });

    it("should return false if latest version is undefined", () => {
      const latestV = undefined;
      const currentV = "0.1.0";
      expect(CacheUtilities.SemverGreaterThan(latestV, currentV)).toEqual(
        false
      );
    });

    it("should return false if current version is null", () => {
      const latestV = "0.1.0";
      const currentV = null;

      expect(CacheUtilities.SemverGreaterThan(latestV, currentV)).toEqual(
        false
      );
    });

    it("should return false if current version is undefined", () => {
      const latestV = "0.1.0";
      const currentV = undefined;
      expect(CacheUtilities.SemverGreaterThan(latestV, currentV)).toEqual(
        false
      );
    });

    it("should return false if latest version is incomplete", () => {
      const latestV = "0.1.";
      const currentV = "0.1.0";
      expect(CacheUtilities.SemverGreaterThan(latestV, currentV)).toEqual(
        false
      );
    });
  });

  describe("FetchMetaFile", () => {
    const globalAny: any = global;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should fetch a meta.json file", async () => {
      globalAny.fetch = jest.fn(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              version: "0.1.1"
            })
        })
      );
      const result = await CacheUtilities.FetchMetaFile();
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual("0.1.1");
    });

    it("FetchMetaFile should return null if an exception", async () => {
      const globalAny: any = global;
      globalAny.fetch.mockImplementationOnce(() =>
        Promise.reject("Fetch call failure")
      );

      const result = await CacheUtilities.FetchMetaFile();
      expect(result).toEqual(null);
      expect(fetch).toBeCalledTimes(1);
    });
  });
});
