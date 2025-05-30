import {
  mockLtftDraft0,
  mockLtftDraft1,
  mockLtftDto1
} from "../../mock-data/mock-ltft-data";
import { mockCctCalc } from "../../mock-data/mock-cct-data";
import { mockPersonalDetails } from "../../mock-data/trainee-profile";
import {
  mapLtftDtoToObj,
  mapLtftObjToDto,
  populateLtftDraft
} from "../ltftUtilities";
import { StatusInfo } from "../../redux/slices/ltftSlice";
const otherDiscussions = [
  {
    name: "My other discussion 1",
    email: "My other discussion 1 email",
    role: "Associate Dean"
  },
  {
    name: "My other discussion 2",
    email: "My other discussion 2 email",
    role: "Educational Supervisor (ES)"
  }
];

const statusData = {
  current: {
    state: "DRAFT",
    detail: {
      reason: "",
      message: ""
    },
    modifiedBy: {
      name: "",
      email: "",
      role: ""
    },
    timestamp: "",
    revision: 0
  } as StatusInfo,
  history: [] as StatusInfo[]
};

const dateCreated = "2025-02-01T00:00:00Z";
const dateModified = "2025-02-02T00:00:00Z";

describe("populateLtftDraft", () => {
  const cctSnapshot = mockCctCalc;
  const personalDetails = mockPersonalDetails;
  const traineeTisId = "4";
  it("should populate the ltft draft correctly", () => {
    const ltftDraft = populateLtftDraft(
      cctSnapshot,
      personalDetails,
      traineeTisId
    );
    expect(ltftDraft).toEqual(mockLtftDraft0);
  });
});

describe("mapLtftObjToDto", () => {
  const ltftDto = mapLtftObjToDto({
    ...mockLtftDraft1,
    otherDiscussions: otherDiscussions,
    status: statusData,
    created: dateCreated,
    lastModified: dateModified
  });
  it("should map discussions correctly", () => {
    expect(ltftDto.discussions).toEqual({
      tpdName: "",
      tpdEmail: "",
      other: otherDiscussions
    });
  });

  it("should map reasons correctly", () => {
    expect(ltftDto.reasons).toEqual({
      selected: [],
      otherDetail: "",
      supportingInformation: null
    });
  });

  it("should map other properties correctly", () => {
    expect(ltftDto.id).toBe("fc13458c-5b0b-442f-8907-6f9af8fc0ffb");
    expect(ltftDto.name).toBe("My Programme - Hours Reduction");
    expect(ltftDto.change).toEqual({
      calculationId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      changeId: "fc13458c-5b0b-442f-8907-6f9af8fc0ffb",
      cctDate: "2028-04-02",
      type: "LTFT",
      startDate: "2027-01-01",
      wte: 0.8
    });
    expect(ltftDto.declarations).toEqual({
      discussedWithTpd: true,
      informationIsCorrect: true,
      notGuaranteed: true
    });
    expect(ltftDto.personalDetails).toEqual({
      title: "Mr",
      surname: "Gilliam",
      forenames: "Anthony Mara",
      telephoneNumber: "01632960363",
      mobileNumber: "07465879348",
      email: "email@email.com",
      gmcNumber: "1111111",
      gdcNumber: "",
      publicHealthNumber: "",
      skilledWorkerVisaHolder: false
    });
    expect(ltftDto.programmeMembership).toEqual({
      id: "a6de88b8-de41-48dd-9492-a518f5001176",
      name: "Cardiology",
      startDate: "2020-01-01",
      endDate: "2028-01-01",
      wte: 1,
      designatedBodyCode: "WTF3",
      managingDeanery: "North North West"
    });
    expect(ltftDto.status).toEqual(statusData);
    expect(ltftDto.created).toBe(dateCreated);
    expect(ltftDto.lastModified).toBe(dateModified);
  });
});

describe("mapDtoToLtftObj", () => {
  const mockLtftObj = mapLtftDtoToObj({
    traineeTisId: "4",
    ...mockLtftDto1,
    discussions: {
      tpdName: "My tpd name",
      tpdEmail: "email@4.tpd",
      other: otherDiscussions
    },
    change: {
      calculationId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      changeId: "fc13458c-5b0b-442f-8907-6f9af8fc0ffb",
      cctDate: "2028-04-02",
      type: "LTFT",
      startDate: "2027-01-01",
      wte: 0.8
    },
    reasons: {
      selected: ["Unique opportunities", "other"],
      otherDetail: "my other reason 2",
      supportingInformation: "my supporting info"
    },
    status: statusData,
    created: dateCreated,
    lastModified: dateModified,
    formRef: "ltft_-1_003"
  });
  it("should map discussions correctly", () => {
    expect(mockLtftObj.tpdName).toEqual("My tpd name");
    expect(mockLtftObj.tpdEmail).toEqual("email@4.tpd");
    expect(mockLtftObj.otherDiscussions).toEqual(otherDiscussions);
  });

  it("should map reasons correctly", () => {
    expect(mockLtftObj.reasonsSelected).toEqual([
      "Unique opportunities",
      "other"
    ]);
    expect(mockLtftObj.reasonsOtherDetail).toEqual("my other reason 2");
    expect(mockLtftObj.supportingInformation).toEqual("my supporting info");
  });

  it("should map other properties correctly", () => {
    expect(mockLtftObj.id).toBe("fc13458c-5b0b-442f-8907-6f9af8fc0ffb");
    expect(mockLtftObj.name).toBe("My Programme - Hours Reduction");
    expect(mockLtftObj.change).toEqual({
      calculationId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      cctDate: "2028-04-02",
      changeId: "fc13458c-5b0b-442f-8907-6f9af8fc0ffb",
      type: "LTFT",
      startDate: "2027-01-01",
      wte: 0.8
    });
    expect(mockLtftObj.declarations).toEqual({
      discussedWithTpd: true,
      informationIsCorrect: true,
      notGuaranteed: true
    });
    expect(mockLtftObj.traineeTisId).toEqual("4");
    expect(mockLtftObj.personalDetails).toEqual({
      title: "Mr",
      surname: "Gilliam",
      forenames: "Anthony Mara",
      telephoneNumber: "01632960363",
      mobileNumber: "07465879348",
      email: "email@email.com",
      gmcNumber: "1111111",
      gdcNumber: "",
      publicHealthNumber: "",
      skilledWorkerVisaHolder: false
    });
    expect(mockLtftObj.programmeMembership).toEqual({
      id: "a6de88b8-de41-48dd-9492-a518f5001176",
      name: "Cardiology",
      startDate: "2020-01-01",
      endDate: "2028-01-01",
      wte: 1,
      designatedBodyCode: "WTF3",
      managingDeanery: "North North West"
    });
    expect(mockLtftObj.status).toEqual(statusData);
    expect(mockLtftObj.created).toBe(dateCreated);
    expect(mockLtftObj.lastModified).toBe(dateModified);
  });
});
