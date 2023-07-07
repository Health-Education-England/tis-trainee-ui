import { ReferenceDataUtilities } from "../ReferenceDataUtilities";
import { KeyValue } from "../../models/KeyValue";
import { workPlacementsForArcpFilter } from "../../mock-data/work-placements-list";

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

  // Type of Work (ARCP year) filter tests
  it("should return the submitted Type of Work array if no ARCP year provided", () => {
    const testYear = null;
    const arcpWorkArr = ReferenceDataUtilities.filterArcpWorkPlacements(
      workPlacementsForArcpFilter,
      testYear
    );
    expect(arcpWorkArr).toEqual(workPlacementsForArcpFilter);
  });

  it("should return an empty array if no Type of Work falls within the ARCP period for the year provided", () => {
    const testYear = new Date("2019-01-01");
    const arcpWorkArr = ReferenceDataUtilities.filterArcpWorkPlacements(
      workPlacementsForArcpFilter,
      testYear
    );
    expect(arcpWorkArr).toEqual([]);
  });

  it("should return an array of Type of Work that falls within the ARCP period for the year provided", () => {
    const expectedArr = [
      {
        endDate: "2023-08-15",
        site: "Site 1",
        siteLocation: "Location 1",
        startDate: "2023-07-01",
        trainingPost: "Post 1",
        typeOfWork: "Type 1"
      },
      {
        endDate: "2023-08-20",
        site: "Site 3",
        siteLocation: "Location 3",
        startDate: "2023-08-01",
        trainingPost: "Post 3",
        typeOfWork: "Type 3"
      },
      {
        endDate: "2025-08-20",
        site: "Site 5",
        siteLocation: "Location 5",
        startDate: "2020-08-10",
        trainingPost: "Post 5",
        typeOfWork: "Type 5"
      }
    ];
    const testYear = new Date("2022-01-01");
    const arcpWorkArr = ReferenceDataUtilities.filterArcpWorkPlacements(
      workPlacementsForArcpFilter,
      testYear
    );
    expect(arcpWorkArr).toEqual(expectedArr);
  });

  it("should return the first Wednesday for a given year and the Tuesday before the first Wednesday in August the following year", () => {
    const firstWedInAugust = new Date("2023-08-02");
    const tueBeforeFirstWedNextAugust = new Date("2024-08-06");
    expect(
      ReferenceDataUtilities.thisAugFirstWedAndNextAugTueBeforeFirstWed(2023)
    ).toEqual({ firstWedInAugust, tueBeforeFirstWedNextAugust });
  });
});
