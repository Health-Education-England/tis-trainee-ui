import { ReferenceDataUtilities } from "../ReferenceDataUtilities";
import { KeyValue } from "../../models/KeyValue";

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
});
