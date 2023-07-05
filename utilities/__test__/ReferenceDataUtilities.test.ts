import { ReferenceDataUtilities } from "../ReferenceDataUtilities";
import { KeyValue } from "../../models/KeyValue";
import {
  arcpWorkArr,
  trimmedAndSortedWorkArrWithin2023ARCP,
  trimmedAndSortedWorkArrWithin2020ARCP
} from "../../mock-data/work-placements-list";

const refData: KeyValue[] = [
  { tisId: "1", label: "Label one", value: "Value one" },
  { tisId: "2", label: "Label two", value: "Value two" },
  { tisId: "3", label: "Label three", value: "Value three" }
];

describe("ReferenceDataUtilities", () => {
  it("Should return true when matching tisID of '1' to label 'Label one'", () => {
    expect(
      ReferenceDataUtilities.isMatchInReferenceData(["1"], "Label one", refData)
    ).toBe(true);
  });

  it("Should return true when matching tisID of '1 or 2' passed as an array to label 'Label one'", () => {
    expect(
      ReferenceDataUtilities.isMatchInReferenceData(
        ["1", "2"],
        "Label one",
        refData
      )
    ).toBe(true);
  });
  it("Should return false when matching tisID of '1' to label 'Label two'", () => {
    expect(
      ReferenceDataUtilities.isMatchInReferenceData(["1"], "Label two", refData)
    ).toBe(false);
  });

  it("Should return false when matching tisID of '1 or 2' passed as an array to label 'Label three'", () => {
    expect(
      ReferenceDataUtilities.isMatchInReferenceData(
        ["1", "2"],
        "Label three",
        refData
      )
    ).toBe(false);
  });

  it("should return false when formDataProp not matched.", () => {
    expect(ReferenceDataUtilities.isMatchedItem(refData, "Label 4")).toBe(
      false
    );
  });

  it("should return true when formDataProp matched.", () => {
    expect(ReferenceDataUtilities.isMatchedItem(refData, "Label three")).toBe(
      true
    );
  });

  it("should return blank string (i.e. reset field) if no match", () => {
    const matchedProp: string = "no match this time";
    const formDataProp = ReferenceDataUtilities.checkDataProp(
      refData,
      matchedProp
    );
    expect(formDataProp).toEqual("");
  });

  it("should return matched prop (i.e. keep field value) if match", () => {
    const matchedProp: string = "Label three";
    const formDataProp = ReferenceDataUtilities.checkDataProp(
      refData,
      matchedProp
    );
    expect(formDataProp).toEqual(matchedProp);
  });

  it("should return filter out types of work outside the ARCP date for 2023 & 2020", () => {
    //check for 2023
    jest.useFakeTimers().setSystemTime(new Date("2023-01-01"));
    const work2023 = ReferenceDataUtilities.filterArcpWorkPlacements(
      arcpWorkArr,
      2023
    );

    expect(arcpWorkArr).not.toEqual(work2023);

    expect(work2023).toEqual(trimmedAndSortedWorkArrWithin2023ARCP);
    //check for 2020
    jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
    const work2020 = ReferenceDataUtilities.filterArcpWorkPlacements(
      arcpWorkArr,
      2020
    );
    expect(arcpWorkArr).not.toEqual(work2020);
    expect(work2020).toEqual(trimmedAndSortedWorkArrWithin2020ARCP);
  });

  it("should return the first wednesday for each year", () => {
    const firstWednesdayInAugust1973 = new Date(1973, 7, 1);
    const firstWednesdayInAugust2020 = new Date(2020, 7, 5);
    const firstWednesdayInAugust2043 = new Date(2044, 7, 3);

    var firstWednesday = ReferenceDataUtilities.firstWednesdayInAugust(1973);

    expect(firstWednesday).toEqual(firstWednesdayInAugust1973);

    firstWednesday = ReferenceDataUtilities.firstWednesdayInAugust(2020);

    expect(firstWednesday).toEqual(firstWednesdayInAugust2020);

    firstWednesday = ReferenceDataUtilities.firstWednesdayInAugust(2044);

    expect(firstWednesday).toEqual(firstWednesdayInAugust2043);
  });

  it("should return the first tuesday of august for the following year", () => {
    const firstTuesdayInAugust1994 = new Date(1994, 7, 2);
    const firstTuesdayInAugust2025 = new Date(2025, 7, 5);
    const firstTuesdayInAugust2044 = new Date(2044, 7, 2);

    var followingTuesday =
      ReferenceDataUtilities.tueBeforeFirstWedNextAugust(1993);

    expect(followingTuesday).toEqual(firstTuesdayInAugust1994);

    var followingTuesday =
      ReferenceDataUtilities.tueBeforeFirstWedNextAugust(2024);

    expect(followingTuesday).toEqual(firstTuesdayInAugust2025);

    var followingTuesday =
      ReferenceDataUtilities.tueBeforeFirstWedNextAugust(2043);

    expect(followingTuesday).toEqual(firstTuesdayInAugust2044);
  });
});
