import {
  SIGNABLE_OFFSET,
  canBeSigned,
  getStatusText,
  getVersionText
} from "../CojUtilities";

describe("CojUtilities", () => {
  describe("getStatusText", () => {
    it("should return unknown when start date is null", () => {
      expect(getStatusText(null)).toEqual("Unknown status");
    });

    it("should return submitted to LO when start date before coj epoch", () => {
      const minDate = new Date(-8640000000000000).toISOString();
      expect(getStatusText(minDate)).toEqual(
        "Submitted directly to Local Office"
      );
    });

    it("should return Not signed, available from 14/06/275760 when start date in the far future", () => {
      const maxDate = new Date(8640000000000000);
      const expectedDate = new Date(maxDate.getTime() - SIGNABLE_OFFSET);

      expect(getStatusText(maxDate.toISOString())).toEqual(
        "Not signed, available from " + expectedDate.toLocaleDateString()
      );
    });
  });

  describe("canBeSigned", () => {
    it("should return false when start date before coj epoch", () => {
      const aDate = new Date("2023-07-31");
      
      expect(canBeSigned(aDate, new Date())).toEqual(
        false
      );
    });

    it("should return false when start date after coj epoch and more than 13 weeks after now", () => {
      const aDate = new Date("2023-08-30");
      const now = new Date("2023-05-30");
      
      expect(canBeSigned(aDate, now)).toEqual(
        false
      );
    });

    it("should return true when start date after coj epoch and no more than 13 weeks after now", () => {
      const aDate = new Date("2023-08-30");
      const now = new Date("2023-05-31");
      
      expect(canBeSigned(aDate, now)).toEqual(
        true
      );
    });
  });

  describe("getVersionText", () => {
    it("should return formatted Gold Guide version when GGx format", () => {
      expect(getVersionText("GG0")).toEqual("Gold Guide 0");
      expect(getVersionText("GG1")).toEqual("Gold Guide 1");
      expect(getVersionText("GG2")).toEqual("Gold Guide 2");
      expect(getVersionText("GG3")).toEqual("Gold Guide 3");
      expect(getVersionText("GG4")).toEqual("Gold Guide 4");
      expect(getVersionText("GG5")).toEqual("Gold Guide 5");
      expect(getVersionText("GG6")).toEqual("Gold Guide 6");
      expect(getVersionText("GG7")).toEqual("Gold Guide 7");
      expect(getVersionText("GG8")).toEqual("Gold Guide 8");
      expect(getVersionText("GG9")).toEqual("Gold Guide 9");
    });

    it("should return formatted Gold Guide version when GGxx format", () => {
      expect(getVersionText("GG12")).toEqual("Gold Guide 12");
    });

    it("should return unknown when incorrect format", () => {
      expect(getVersionText("prefixGG1")).toEqual("Unknown");
      expect(getVersionText("GG1suffix")).toEqual("Unknown");
      expect(getVersionText("prefixGG1suffix")).toEqual("Unknown");
      expect(getVersionText("GG")).toEqual("Unknown");
      expect(getVersionText("abc")).toEqual("Unknown");
      expect(getVersionText("123")).toEqual("Unknown");
    });
  });
});
