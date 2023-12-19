import {
  mockProgrammeMembershipCojNotSigned,
  mockProgrammeMembershipCojSigned
} from "../../mock-data/trainee-profile";
import { CojUtilities } from "../CojUtilities";
import { DateUtilities } from "../DateUtilities";

describe("CojUtilities", () => {
  const SIGNING_WINDOW_OFFSET_IN_MS = 13 * 7 * 24 * 60 * 60 * 1000; // 13 weeks
  const DAY_IN_MS = 24 * 60 * 60 * 1000;

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

    it("should return not signed with available date when start date equal to coj epoch and currently before signing window opens", () => {
      const startDate = new Date(COJ_EPOCH);
      const signableDate = new Date(
        startDate.getTime() - SIGNING_WINDOW_OFFSET_IN_MS
      );

      jest.setSystemTime(new Date(signableDate.getTime() - DAY_IN_MS));

      const availableDate = DateUtilities.ToLocalDate(signableDate);
      expect(CojUtilities.getStatusText(startDate.toISOString())).toEqual(
        `Not signed, available from ${availableDate}`
      );
    });

    it("should return not signed with available date when start date after coj epoch and currently before signing window opens", () => {
      const startDate = new Date(POST_COJ_EPOCH);
      const signableDate = new Date(
        startDate.getTime() - SIGNING_WINDOW_OFFSET_IN_MS
      );

      jest.setSystemTime(new Date(signableDate.getTime() - DAY_IN_MS));

      const availableDate = DateUtilities.ToLocalDate(signableDate);
      expect(CojUtilities.getStatusText(startDate.toISOString())).toEqual(
        `Not signed, available from ${availableDate}`
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

      jest.setSystemTime(signableDate);

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

  describe("canBeSigned", () => {
    it("should return false when start date before coj epoch and currently before signing window", () => {
      const startDate = new Date(PRE_COJ_EPOCH);
      const signableDate = new Date(
        startDate.getTime() - SIGNING_WINDOW_OFFSET_IN_MS
      );

      jest.setSystemTime(signableDate);

      expect(CojUtilities.canBeSigned(startDate)).toEqual(false);
    });

    it("should return false when start date before coj epoch and currently equal to signing window", () => {
      const startDate = new Date(PRE_COJ_EPOCH);
      const signableDate = new Date(
        startDate.getTime() - SIGNING_WINDOW_OFFSET_IN_MS
      );

      jest.setSystemTime(new Date(signableDate.getTime() - DAY_IN_MS));

      expect(CojUtilities.canBeSigned(startDate)).toEqual(false);
    });

    it("should return false when start date before coj epoch and currently after signing window", () => {
      const startDate = new Date(PRE_COJ_EPOCH);
      const signableDate = new Date(
        startDate.getTime() - SIGNING_WINDOW_OFFSET_IN_MS
      );

      jest.setSystemTime(new Date(signableDate.getTime() + DAY_IN_MS));

      expect(CojUtilities.canBeSigned(startDate)).toEqual(false);
    });

    it("should return false when start date equal to coj epoch and currently before signing window", () => {
      const startDate = new Date(COJ_EPOCH);
      const signableDate = new Date(
        startDate.getTime() - SIGNING_WINDOW_OFFSET_IN_MS
      );

      jest.setSystemTime(new Date(signableDate.getTime() - DAY_IN_MS));

      expect(CojUtilities.canBeSigned(startDate)).toEqual(false);
    });

    it("should return false when start date equal to coj epoch and currently equal to signing window", () => {
      const startDate = new Date(COJ_EPOCH);
      const signableDate = new Date(
        startDate.getTime() - SIGNING_WINDOW_OFFSET_IN_MS
      );

      jest.setSystemTime(signableDate);

      expect(CojUtilities.canBeSigned(startDate)).toEqual(true);
    });

    it("should return false when start date equal to coj epoch and currently after signing window", () => {
      const startDate = new Date(COJ_EPOCH);
      const signableDate = new Date(
        startDate.getTime() - SIGNING_WINDOW_OFFSET_IN_MS
      );

      jest.setSystemTime(new Date(signableDate.getTime() + DAY_IN_MS));

      expect(CojUtilities.canBeSigned(startDate)).toEqual(true);
    });

    it("should return false when start date after coj epoch and currently before signing window", () => {
      const startDate = new Date(POST_COJ_EPOCH);
      const signableDate = new Date(
        startDate.getTime() - SIGNING_WINDOW_OFFSET_IN_MS
      );

      jest.setSystemTime(new Date(signableDate.getTime() - DAY_IN_MS));

      expect(CojUtilities.canBeSigned(startDate)).toEqual(false);
    });

    it("should return true when start date after coj epoch and currently equal to signing window", () => {
      const startDate = new Date(POST_COJ_EPOCH);
      const signableDate = new Date(
        startDate.getTime() - SIGNING_WINDOW_OFFSET_IN_MS
      );

      jest.setSystemTime(signableDate);

      expect(CojUtilities.canBeSigned(startDate)).toEqual(true);
    });

    it("should return true when start date after coj epoch and currently after signing window", () => {
      const startDate = new Date(POST_COJ_EPOCH);
      const signableDate = new Date(
        startDate.getTime() - SIGNING_WINDOW_OFFSET_IN_MS
      );

      jest.setSystemTime(new Date(signableDate.getTime() + DAY_IN_MS));

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
        ...mockProgrammeMembershipCojNotSigned,
        startDate: new Date(PRE_COJ_EPOCH)
      };
      const preSignableDate = {
        ...mockProgrammeMembershipCojNotSigned,
        startDate: new Date(
          currentDate.getTime() + SIGNING_WINDOW_OFFSET_IN_MS + DAY_IN_MS
        )
      };

      jest.setSystemTime(currentDate);

      expect(
        CojUtilities.canAnyBeSigned([signed, preCojEpoch, preSignableDate])
      ).toEqual(false);
    });

    it("should return true when a programme membership is post-coj epoch", () => {
      const currentDate = new Date(COJ_EPOCH);

      const signed = mockProgrammeMembershipCojSigned;
      const postCojEpoch = {
        ...mockProgrammeMembershipCojNotSigned,
        startDate: new Date(POST_COJ_EPOCH)
      };
      const preSignableDate = {
        ...mockProgrammeMembershipCojNotSigned,
        startDate: new Date(
          currentDate.getTime() + SIGNING_WINDOW_OFFSET_IN_MS + DAY_IN_MS
        )
      };

      jest.setSystemTime(currentDate);

      expect(
        CojUtilities.canAnyBeSigned([signed, postCojEpoch, preSignableDate])
      ).toEqual(true);
    });

    it("should return true when a programme membership is post-signable date", () => {
      const currentDate = new Date(COJ_EPOCH);

      const signed = mockProgrammeMembershipCojSigned;
      const preCojEpoch = {
        ...mockProgrammeMembershipCojNotSigned,
        startDate: new Date(PRE_COJ_EPOCH)
      };
      const postSignableDate = {
        ...mockProgrammeMembershipCojNotSigned,
        startDate: new Date(currentDate.getTime() + SIGNING_WINDOW_OFFSET_IN_MS)
      };

      jest.setSystemTime(currentDate);

      expect(
        CojUtilities.canAnyBeSigned([signed, preCojEpoch, postSignableDate])
      ).toEqual(true);
    });

    it("should return true when all programme memberships can be signed", () => {
      const currentDate = new Date(COJ_EPOCH);

      const postCojEpoch = {
        ...mockProgrammeMembershipCojNotSigned,
        startDate: new Date(POST_COJ_EPOCH)
      };
      const postSignableDate = {
        ...mockProgrammeMembershipCojNotSigned,
        startDate: new Date(currentDate.getTime() + SIGNING_WINDOW_OFFSET_IN_MS)
      };

      jest.setSystemTime(currentDate);

      expect(
        CojUtilities.canAnyBeSigned([postCojEpoch, postSignableDate])
      ).toEqual(true);
    });
  });
});

describe("CojUtilities (for Action Summary and Alert) - unsignedCojs", () => {
  it("should return an unsigned CoJ Programme when no signedAt date", () => {
    expect(
      CojUtilities.unsignedCojs([mockProgrammeMembershipCojNotSigned])
    ).toEqual([mockProgrammeMembershipCojNotSigned]);
  });
  it("should return an empty array when all CoJ Programmes are signed", () => {
    expect(
      CojUtilities.unsignedCojs([
        {
          ...mockProgrammeMembershipCojSigned,
          conditionsOfJoining: { signedAt: new Date(), version: "GG1" }
        }
      ])
    ).toEqual([]);
  });
});
