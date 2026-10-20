import { CctChange, CctPeriod, CctResult } from "../../models/CctTypes";
import {
  findCctProjectionPeriod,
  pickCctPeriods,
  sortCctChanges,
  toCctChangeDtos
} from "../CctUtilities";

const change = (id: string, startDate = "2024-02-01"): CctChange => ({
  id,
  type: "PARENTAL",
  startDate,
  endDate: "2024-08-01",
  wte: null,
  countsTowardsCompletion: false
});

const period = (kind: CctPeriod["kind"], startDate: string): CctPeriod => ({
  kind,
  startDate,
  endDate: "2024-08-01",
  calendarMonths: 6,
  wteMonths: 0
});

describe("sortCctChanges", () => {
  it("orders the changes by start date whatever order they were added in", () => {
    const sorted = sortCctChanges([
      change("second", "2025-01-01"),
      change("first", "2024-02-01"),
      change("third", "2026-03-01")
    ]);

    expect(sorted.map(c => c.id)).toEqual(["first", "second", "third"]);
  });

  it("keeps changes that start on the same date in the order they were added", () => {
    const sorted = sortCctChanges([
      change("added-first", "2024-02-01"),
      change("added-second", "2024-02-01")
    ]);

    expect(sorted.map(c => c.id)).toEqual(["added-first", "added-second"]);
  });

  it("leaves the changes it was given untouched", () => {
    const changes = [change("later", "2025-01-01"), change("earlier")];
    sortCctChanges(changes);

    expect(changes.map(c => c.id)).toEqual(["later", "earlier"]);
  });
});

describe("toCctChangeDtos", () => {
  it("drops the client-only id from every change", () => {
    const dtos = toCctChangeDtos([change("one"), change("two")]);

    expect(dtos).toHaveLength(2);
    dtos.forEach(dto => expect(dto).not.toHaveProperty("id"));
    expect(dtos[0]).toEqual({
      type: "PARENTAL",
      startDate: "2024-02-01",
      endDate: "2024-08-01",
      wte: null,
      countsTowardsCompletion: false
    });
  });

  it("leaves the changes it was given untouched", () => {
    const changes = [change("one")];
    toCctChangeDtos(changes);

    expect(changes[0].id).toBe("one");
  });
});

describe("pickCctPeriods", () => {
  const result: CctResult = {
    cctDate: "2031-07-29",
    periods: [
      period("CHANGE", "2024-02-01"),
      period("ASSUMED_FULL_TIME", "2023-08-02"),
      period("ASSUMED_FULL_TIME", "2024-08-02"),
      period("PROJECTION", "2025-01-01")
    ]
  };

  it("returns the periods of one kind, in the order the engine gave them", () => {
    const picked = pickCctPeriods(result, "ASSUMED_FULL_TIME", 2);

    expect(picked.map(p => p?.startDate)).toEqual(["2023-08-02", "2024-08-02"]);
  });

  it("returns all nulls when the count does not match the rows on screen", () => {
    expect(pickCctPeriods(result, "ASSUMED_FULL_TIME", 3)).toEqual([
      null,
      null,
      null
    ]);
  });

  it("returns all nulls when there is no result yet", () => {
    expect(pickCctPeriods(null, "CHANGE", 2)).toEqual([null, null]);
  });
});

describe("findCctProjectionPeriod", () => {
  it("finds the projection row and tolerates a result without periods", () => {
    const periods = [period("CHANGE", "2024-02-01"), period("PROJECTION", "x")];

    expect(
      findCctProjectionPeriod({ cctDate: "2031-07-29", periods })?.startDate
    ).toBe("x");
    expect(findCctProjectionPeriod({ cctDate: "2031-07-29" })).toBeNull();
  });
});
