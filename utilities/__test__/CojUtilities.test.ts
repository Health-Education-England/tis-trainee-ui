import {
  mockProgrammeMembershipCojNotSigned,
  mockProgrammeMembershipCojSigned
} from "../../mock-data/trainee-profile";
import { CojUtilities } from "../CojUtilities";
import { DateUtilities } from "../DateUtilities";

describe("CojUtilities", () => {
  // Dates based on env.test value.
  const COJ_EPOCH = "2010-10-14";
  const PRE_COJ_EPOCH = "2010-10-13";
  const POST_COJ_EPOCH = "2010-10-15";

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe("getStatusText", () => {
    it("should return unknown when start date is null", () => {
      expect(CojUtilities.getStatusText(null)).toEqual("Unknown status");
    });

    it("should return submitted to LO when start date before coj epoch", () => {
      const minDate = new Date(PRE_COJ_EPOCH).toISOString();
      expect(CojUtilities.getStatusText(minDate)).toEqual(
        "Follow Local Office process"
      );
    });

    it("should return not signed when start date equal to coj epoch", () => {
      const startDate = new Date(COJ_EPOCH);
      expect(CojUtilities.getStatusText(startDate.toISOString())).toEqual(
        "Not signed"
      );
    });

    it("should return not signed when start date after coj epoch", () => {
      const startDate = new Date(POST_COJ_EPOCH);
      expect(CojUtilities.getStatusText(startDate.toISOString())).toEqual(
        "Not signed"
      );
    });
  });

  describe("getVersionText", () => {
    it("should return formatted Gold Guide version when GGx format", () => {
      expect(CojUtilities.getVersionText("GG9")).toEqual("Gold Guide 9");
      expect(CojUtilities.getVersionText("GG10")).toEqual("Gold Guide 10");
    });
  });

  describe("canBeSigned", () => {
    it("should return false when start date before coj epoch", () => {
      const startDate = new Date(PRE_COJ_EPOCH);
      expect(CojUtilities.canBeSigned(startDate)).toEqual(false);
    });

    it("should return true when start date equal to coj epoch", () => {
      const startDate = new Date(COJ_EPOCH);
      expect(CojUtilities.canBeSigned(startDate)).toEqual(true);
    });

    it("should return true when start date after coj epoch", () => {
      const startDate = new Date(POST_COJ_EPOCH);
      expect(CojUtilities.canBeSigned(startDate)).toEqual(true);
    });
  });

  describe("canAnyBeSigned", () => {
    it("should return false when empty programme memberships", () => {
      expect(CojUtilities.canAnyBeSigned([])).toEqual(false);
    });

    it("should return false when no programme memberships can be signed", () => {
      const currentDate = new Date(COJ_EPOCH);

      const signed = mockProgrammeMembershipCojSigned;
      const preCojEpoch = {
        ...mockProgrammeMembershipCojNotSigned[0],
        startDate: new Date(PRE_COJ_EPOCH)
      };

      jest.setSystemTime(currentDate);

      expect(CojUtilities.canAnyBeSigned([signed, preCojEpoch])).toEqual(false);
    });

    it("should return true when a programme membership is post-coj epoch", () => {
      const currentDate = new Date(COJ_EPOCH);

      const signed = mockProgrammeMembershipCojSigned;
      const postCojEpoch = {
        ...mockProgrammeMembershipCojNotSigned[0],
        startDate: new Date(POST_COJ_EPOCH)
      };

      jest.setSystemTime(currentDate);

      expect(CojUtilities.canAnyBeSigned([signed, postCojEpoch])).toEqual(true);
    });

    it("should return true when all programme memberships can be signed", () => {
      const currentDate = new Date(COJ_EPOCH);

      const postCojEpoch = {
        ...mockProgrammeMembershipCojNotSigned[0],
        startDate: new Date(POST_COJ_EPOCH)
      };

      jest.setSystemTime(currentDate);

      expect(CojUtilities.canAnyBeSigned([postCojEpoch, postCojEpoch])).toEqual(
        true
      );
    });
  });
});

describe("CojUtilities (for Action Summary and Alert) - unsignedCojs", () => {
  it("should return an unsigned CoJ Programme when no signedAt date", () => {
    expect(
      CojUtilities.unsignedCojs([mockProgrammeMembershipCojNotSigned[0]])
    ).toEqual([mockProgrammeMembershipCojNotSigned[0]]);
  });
  it("should return an empty array when all CoJ Programmes are signed", () => {
    expect(
      CojUtilities.unsignedCojs([
        {
          ...mockProgrammeMembershipCojSigned,
          conditionsOfJoining: { signedAt: new Date(), version: "GG10" }
        }
      ])
    ).toEqual([]);
  });
});
