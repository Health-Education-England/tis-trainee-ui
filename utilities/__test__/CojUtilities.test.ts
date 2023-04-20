import { getStatusText, getVersionText } from "../CojUtilities";

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

    it("should return CoJ can only be signed within 13 weeks of the start date when start date equal to coj epoch and earlier than 13 weeks", () => {
      expect(getStatusText("2023-08-01")).toEqual("CoJ can only be signed within 13 weeks of the start date");
    });

    it("should return not signed when start date after coj epoch", () => {
      const maxDate = new Date(8640000000000000).toISOString();
      expect(getStatusText(maxDate)).toEqual("Not signed");
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
