import { CojUtilities } from "../CojUtilities";

describe("CojUtilities", () => {
  describe("getStatusText", () => {
    const SIGNING_WINDOW_OFFSET_IN_MS = 13 * 7 * 24 * 60 * 60 * 1000; // 13 weeks
    const DAY_IN_MS = 24 * 60 * 60 * 1000;

    const COJ_EPOCH = "2023-08-01";
    const PRE_COJ_EPOCH = "2023-07-31";
    const POST_COJ_EPOCH = "2023-08-02";

    beforeAll(() => {
      jest.useFakeTimers();
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("should return unknown when start date is null", () => {
      expect(CojUtilities.getStatusText(null)).toEqual("Unknown status");
    });

    it("should return submitted to LO when start date before coj epoch", () => {
      const minDate = new Date(PRE_COJ_EPOCH).toISOString();
      expect(CojUtilities.getStatusText(minDate)).toEqual(
        "Submitted directly to Local Office"
      );
    });

    it("should return not signed with available date when start date equal to coj epoch and currently before signing window opens", () => {
      const startDate = new Date(COJ_EPOCH);
      const signableDate = new Date(
        startDate.getTime() - SIGNING_WINDOW_OFFSET_IN_MS
      );

      jest.setSystemTime(new Date(signableDate.getTime() - DAY_IN_MS));

      expect(CojUtilities.getStatusText(startDate.toISOString())).toEqual(
        `Not signed, available from ${signableDate.toLocaleDateString()}`
      );
    });

    it("should return not signed with available date when start date after coj epoch and currently before signing window opens", () => {
      const startDate = new Date(POST_COJ_EPOCH);
      const signableDate = new Date(
        startDate.getTime() - SIGNING_WINDOW_OFFSET_IN_MS
      );

      jest.setSystemTime(new Date(signableDate.getTime() - DAY_IN_MS));

      expect(CojUtilities.getStatusText(startDate.toISOString())).toEqual(
        `Not signed, available from ${signableDate.toLocaleDateString()}`
      );
    });

    it("should return not signed when start date equal to coj epoch and currently after signing window opens", () => {
      const startDate = new Date(COJ_EPOCH);
      const signableDate = new Date(
        startDate.getTime() - SIGNING_WINDOW_OFFSET_IN_MS
      );

      jest.setSystemTime(signableDate);

      expect(CojUtilities.getStatusText(startDate.toISOString())).toEqual(
        "Not signed"
      );
    });

    it("should return not signed when start date after coj epoch and currently after signing window opens", () => {
      const startDate = new Date(POST_COJ_EPOCH);
      const signableDate = new Date(
        startDate.getTime() - SIGNING_WINDOW_OFFSET_IN_MS
      );

      jest.setSystemTime(new Date(signableDate));

      expect(CojUtilities.getStatusText(startDate.toISOString())).toEqual(
        "Not signed"
      );
    });
  });

  describe("getVersionText", () => {
    it("should return formatted Gold Guide version when GGx format", () => {
      expect(CojUtilities.getVersionText("GG0")).toEqual("Gold Guide 0");
      expect(CojUtilities.getVersionText("GG1")).toEqual("Gold Guide 1");
      expect(CojUtilities.getVersionText("GG2")).toEqual("Gold Guide 2");
      expect(CojUtilities.getVersionText("GG3")).toEqual("Gold Guide 3");
      expect(CojUtilities.getVersionText("GG4")).toEqual("Gold Guide 4");
      expect(CojUtilities.getVersionText("GG5")).toEqual("Gold Guide 5");
      expect(CojUtilities.getVersionText("GG6")).toEqual("Gold Guide 6");
      expect(CojUtilities.getVersionText("GG7")).toEqual("Gold Guide 7");
      expect(CojUtilities.getVersionText("GG8")).toEqual("Gold Guide 8");
      expect(CojUtilities.getVersionText("GG9")).toEqual("Gold Guide 9");
    });

    it("should return formatted Gold Guide version when GGxx format", () => {
      expect(CojUtilities.getVersionText("GG12")).toEqual("Gold Guide 12");
    });

    it("should return unknown when incorrect format", () => {
      expect(CojUtilities.getVersionText("prefixGG1")).toEqual("Unknown");
      expect(CojUtilities.getVersionText("GG1suffix")).toEqual("Unknown");
      expect(CojUtilities.getVersionText("prefixGG1suffix")).toEqual("Unknown");
      expect(CojUtilities.getVersionText("GG")).toEqual("Unknown");
      expect(CojUtilities.getVersionText("abc")).toEqual("Unknown");
      expect(CojUtilities.getVersionText("123")).toEqual("Unknown");
    });
  });
});
