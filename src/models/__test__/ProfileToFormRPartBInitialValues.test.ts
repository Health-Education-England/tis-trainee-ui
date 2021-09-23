import { ProfileToFormRPartBInitialValues } from "./../ProfileToFormRPartBInitialValues";
import {
  mockProgrammeMembershipDuplicateCurriculaStart,
  mockProgrammeMembershipNoCurricula,
  mockProgrammeMembershipNoMedicalCurricula,
  mockTraineeProfile
} from "../../mock-data/trainee-profile";
import { FormRPartB } from "../FormRPartB";
import { LifeCycleState } from "../LifeCycleState";

const formrPartB: FormRPartB = {
  traineeTisId: "123",
  forename: "Anthony Mara",
  surname: "Gilliam",
  gmcNumber: "11111111",
  localOfficeName: "Health Education England Thames Valley",
  email: "",
  programmeSpecialty: "ST6",
  prevRevalBody: "",
  prevRevalBodyOther: "",
  currRevalDate: new Date("2021-12-31"),
  prevRevalDate: new Date("2021-12-31"),
  dualSpecialty: "",
  work: [
    {
      endDate: new Date("2020-12-31"),
      site: "Addenbrookes Hospital",
      siteLocation: "Site location",
      startDate: new Date("2020-01-01"),
      trainingPost: "Yes",
      typeOfWork: "In Post ST1 Dermatology"
    }
  ],
  sicknessAbsence: 0,
  parentalLeave: 0,
  careerBreaks: 0,
  paidLeave: 0,
  unauthorisedLeave: 0,
  otherLeave: 0,
  totalLeave: 0,
  isHonest: "",
  isHealthy: "",
  isWarned: "",
  isComplying: "",
  healthStatement: "",
  havePreviousDeclarations: "",
  previousDeclarations: [],
  previousDeclarationSummary: "",
  haveCurrentDeclarations: "",
  currentDeclarations: [],
  currentDeclarationSummary: "",
  compliments: "",
  haveCovidDeclarations: "",
  covidDeclarationDto: null,
  lifecycleState: LifeCycleState.New,
  submissionDate: null,
  lastModifiedDate: null,
  isDeclarationAccepted: false,
  isConsentAccepted: false
};

describe("ProfileToFormRPartBInitialValues", () => {
  it("should return null when null is passed", () => {
    expect(ProfileToFormRPartBInitialValues(null)).toEqual(null);
  });

  it("should return formrPartB when trainee profile is passed", () => {
    expect(ProfileToFormRPartBInitialValues(mockTraineeProfile)).toEqual(
      formrPartB
    );

    expect(
      ProfileToFormRPartBInitialValues(mockTraineeProfile)?.programmeSpecialty
    ).toEqual("ST6");
    expect(
      ProfileToFormRPartBInitialValues(mockTraineeProfile)?.dualSpecialty
    ).toEqual("");
  });

  it("should return formRPartB with empty programmespeciality when no programmeMemberships available", () => {
    const traineeProfile = { ...mockTraineeProfile, programmeMemberships: [] };
    expect(
      ProfileToFormRPartBInitialValues(traineeProfile)?.programmeSpecialty
    ).toEqual("");
    expect(
      ProfileToFormRPartBInitialValues(traineeProfile)?.dualSpecialty
    ).toEqual("");
  });

  it("should return formRPartB with empty programmeSpecialty when no curriculum", () => {
    const traineeProfile = {
      ...mockTraineeProfile,
      programmeMemberships: [mockProgrammeMembershipNoCurricula]
    };

    expect(
      ProfileToFormRPartBInitialValues(traineeProfile)?.programmeSpecialty
    ).toEqual("");
    expect(
      ProfileToFormRPartBInitialValues(traineeProfile)?.dualSpecialty
    ).toEqual("");
  });

  it("should return formRPartB with empty programmeSpecialty when no medical curriculum", () => {
    const traineeProfile = {
      ...mockTraineeProfile,
      programmeMemberships: [mockProgrammeMembershipNoMedicalCurricula]
    };

    expect(
      ProfileToFormRPartBInitialValues(traineeProfile)?.programmeSpecialty
    ).toEqual("");
    expect(
      ProfileToFormRPartBInitialValues(traineeProfile)?.dualSpecialty
    ).toEqual("");
  });

  it("should return formRPartB with first alphabetical programmeSpecialty when latest start date duplicated", () => {
    const traineeProfile = {
      ...mockTraineeProfile,
      programmeMemberships: [mockProgrammeMembershipDuplicateCurriculaStart]
    };

    expect(
      ProfileToFormRPartBInitialValues(traineeProfile)?.programmeSpecialty
    ).toEqual("A");
    expect(
      ProfileToFormRPartBInitialValues(traineeProfile)?.dualSpecialty
    ).toEqual("");
  });

  it("should return formRPartB with empty strings when no personal details available", () => {
    const traineeProfile = { ...mockTraineeProfile, personalDetails: null };
    expect(ProfileToFormRPartBInitialValues(traineeProfile)?.forename).toEqual(
      ""
    );
  });
});
