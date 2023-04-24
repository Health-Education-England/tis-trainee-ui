import { CojUtilities } from "../CojUtilities";

describe("CojUtilities", () => {
  describe("getStatusText", () => {
    const SIGNING_WINDOW_OFFSET_IN_MS = 13 * 7 * 24 * 60 * 60 * 1000; // 13 weeks

    it("should return unknown when start date is null", () => {
      expect(CojUtilities.getStatusText(null)).toEqual("Unknown status");
    });

    it("should return submitted to LO when start date before coj epoch", () => {
      const minDate = new Date(-8640000000000000).toISOString();
      expect(CojUtilities.getStatusText(minDate)).toEqual(
        "Submitted directly to Local Office"
      );
    });

    it("should return Not signed, available from 02/05/2023 when start date equal to coj epoch and earlier than 13 weeks", () => {
      const maxDate = new Date("2023-10-31");
      const expectedDate = new Date(
        maxDate.getTime() - SIGNING_WINDOW_OFFSET_IN_MS
      );

      expect(CojUtilities.getStatusText(maxDate.toISOString())).toEqual(
        "Not signed, available from " + expectedDate.toLocaleDateString()
      );
    });

    it("should return not signed when start date after coj epoch", () => {
      const maxDate = new Date(8640000000000000);
      const expectedDate = new Date(
        maxDate.getTime() - SIGNING_WINDOW_OFFSET_IN_MS
      );

      expect(CojUtilities.getStatusText(maxDate.toISOString())).toEqual(
        "Not signed, available from " + expectedDate.toLocaleDateString()
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
