import { mockPersonalDetails } from "../../mock-data/trainee-profile";
import {
  mapLtftDtoToObj,
  mapLtftObjToDto,
  populateLtftDraftNew
} from "../ltftUtilities";
import {
  mockLtftDraftFirstSuccessSaveResponseDto,
  mockLtftDraftUpdatedPmFormDtoFirstSavePayload,
  mockLtftDraftUpdatedPmFormObjNoSave,
  mockLtftFormObjAfterFirstSave,
  mockLtftNewFormObj
} from "../../mock-data/mock-ltft-data";

describe("populateLtftDraftNew", () => {
  const personalDetails = mockPersonalDetails;
  const traineeTisId = "47165";
  it("should populate the ltft draft correctly", () => {
    const ltftDraft = populateLtftDraftNew(personalDetails, traineeTisId);

    const expectedLtftDraft = {
      ...mockLtftNewFormObj,
      personalDetails: {
        ...mockLtftNewFormObj.personalDetails,
        mobileNumber: "07465879348",
        gdcNumber: "",
        publicHealthNumber: ""
      }
    };
    expect(ltftDraft).toEqual(expectedLtftDraft);
  });
});

describe("mapLtftObjToDto", () => {
  it("should map LtftObj to DTO correctly", () => {
    const mappedDto = mapLtftObjToDto(mockLtftDraftUpdatedPmFormObjNoSave);
    expect(mappedDto).toEqual(mockLtftDraftUpdatedPmFormDtoFirstSavePayload);
  });
});

describe("mapDtoToLtftObj", () => {
  it("should map DTO to LtftObj correctly", () => {
    const ltftObj = mapLtftDtoToObj(mockLtftDraftFirstSuccessSaveResponseDto);
    expect(ltftObj).toEqual(mockLtftFormObjAfterFirstSave);
  });
});
