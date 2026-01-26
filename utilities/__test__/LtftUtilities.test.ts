import { mockPersonalDetails } from "../../mock-data/trainee-profile";
import {
  findLatestSubmissionDate,
  mapLtftDtoToObj,
  mapLtftObjToDto,
  populateLtftDraftNew
} from "../ltftUtilities";
import {
  mockLtftDraftFirstSuccessSaveResponseDto,
  mockLtftDraftUpdatedPmFormDtoFirstSavePayload,
  mockLtftDraftUpdatedPmFormObjNoSave,
  mockLtftFormObjAfterFirstSave,
  mockLtftNewFormObj,
  mockLtftWithCurrentSubmission,
  mockLtftWithMultipleSubmissionHistory,
  mockLtftWithNoSubmissionHistory,
  mockLtftWithSingleSubmissionHistory
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

describe("findLatestSubmissionDate", () => {
  it("should return null if there is no submission history", () => {
    expect(
      findLatestSubmissionDate(mockLtftWithNoSubmissionHistory)
    ).toBeNull();
  });

  it("should return the correct date when there is a single submission in history", () => {
    expect(
      findLatestSubmissionDate(mockLtftWithSingleSubmissionHistory)
    ).toEqual("2026-01-14T10:00:00.000Z");
  });

  it("should return the latest date when there are multiple submissions in history", () => {
    expect(
      findLatestSubmissionDate(mockLtftWithMultipleSubmissionHistory)
    ).toEqual("2026-01-18T10:00:00.000Z");
  });

  it("should return the current timestamp if the current status is SUBMITTED and is latest", () => {
    expect(findLatestSubmissionDate(mockLtftWithCurrentSubmission)).toEqual(
      "2026-01-25T10:00:00.000Z"
    );
  });
});
