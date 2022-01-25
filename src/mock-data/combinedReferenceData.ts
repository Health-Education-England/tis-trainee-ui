import { CombinedReferenceData } from "../models/CombinedReferenceData";

export const mockedCombinedReference: any = {
  gender: [
    { id: "5e7b4bbc2523bc1554f1ce75", tisId: "2", label: "Female" },
    {
      id: "5e7b4bc72523bc1554f1ce76",
      tisId: "9",
      label: "I prefer not to specify"
    },
    { id: "5e7b49217408231554ae8f1e", tisId: "1", label: "Male" }
  ],
  college: [
    {
      id: "5e7b85192523bc1554f1ce7a",
      tisId: "1",
      label: "Faculty Of Dental Surgery"
    },
    {
      id: "5e7b852c2523bc1554f1ce7b",
      tisId: "2",
      label: "Faculty of Intensive Care Medicine"
    },
    {
      id: "5e7b85492523bc1554f1ce7c",
      tisId: "3",
      label: "Faculty of Occupational Medicine"
    }
  ],
  dbc: [
    {
      id: "5e7c8df62523bc1554f1ce84",
      tisId: "17",
      label: "Centre for Health and Disability Assessments (Maximus UK)",
      type: "Occupational Medicine",
      internal: false
    },
    {
      id: "5e7c8df62523bc1554f1ce83",
      tisId: "16",
      label: "Cheshire and Wirral Partnership NHS Foundation Trust",
      type: "NHS Non-Acute Trust",
      internal: false
    },
    {
      id: "5e7c8ddb2523bc1554f1ce7e",
      tisId: "2",
      label: "Health Education England East of England",
      type: "LETB/Deanery",
      internal: true
    },
    {
      id: "5e7c8df62523bc1554f1ce81",
      tisId: "8",
      label: "Health Education England South London",
      type: "LETB/Deanery",
      internal: true
    },
    {
      id: "5e7c8df62523bc1554f1ce80",
      tisId: "5",
      label: "Health Education England Thames Valley",
      type: "LETB/Deanery",
      internal: true
    },
    {
      id: "5e7c8dc32523bc1554f1ce7d",
      tisId: "1",
      label: "Health Education England Wessex",
      type: "LETB/Deanery",
      internal: true
    },
    {
      id: "5e7c8df62523bc1554f1ce82",
      tisId: "15",
      label: "Northern Ireland Medical and Dental Training Agency",
      type: "LETB/Deanery",
      internal: true
    },
    {
      id: "5e7c8df62523bc1554f1ce85",
      tisId: "18",
      label: "Sarnia Yachts Management (UK) Limited",
      type: "Independent Other",
      internal: false
    }
  ],
  localOffice: [
    {
      id: "5e7c8ddb2523bc1554f1ce7e",
      tisId: "2",
      label: "Health Education England East of England"
    },
    {
      id: "5e7c8df62523bc1554f1ce81",
      tisId: "8",
      label: "Health Education England South London"
    },
    {
      id: "5e7c8df62523bc1554f1ce80",
      tisId: "5",
      label: "Health Education England Thames Valley"
    },
    {
      id: "5e7c8dc32523bc1554f1ce7d",
      tisId: "1",
      label: "Health Education England Wessex"
    },
    {
      id: "5e7c8df62523bc1554f1ce7f",
      tisId: "15",
      label: "Northern Ireland Medical and Dental Training Agency"
    }
  ],
  grade: [
    {
      id: "5e8a3ea01f96795a081be04e",
      tisId: "282",
      label: "Core Training Year 2",
      placementGrade: false,
      trainingGrade: false
    },
    {
      id: "5e8a3ead1f96795a081be04f",
      tisId: "287",
      label: "Core Training Year 3",
      placementGrade: false,
      trainingGrade: false
    },
    {
      id: "5e8a3e8f1f96795a081be04d",
      tisId: "279",
      label: "Foundation Year 1",
      placementGrade: false,
      trainingGrade: false
    },
    {
      id: "5e8a3eda1f96795a081be04c",
      tisId: "247",
      label: "Specialty Training Year 6",
      placementGrade: false,
      trainingGrade: false
    }
  ],
  immigrationStatus: [
    {
      id: "614b612cdf97ed1355c73a03",
      tisId: "20",
      label: "British National Overseas"
    },
    {
      id: "614b612cdf97ed1355c739fb",
      tisId: "12",
      label:
        "Other immigration categories i.e. overseas government employees, innovators etc."
    },
    {
      id: "614b612cdf97ed1355c73a10",
      tisId: "33",
      label: "You are the partner/civil partner/spouse of a UK/EEA national"
    }
  ],
  curriculum: [
    {
      id: "5e9724c1dd7b3ba860ba6533",
      tisId: "33",
      label: "ACCS - Anaesthetics",
      curriculumSubType: null,
      status: null
    },
    {
      id: "5e972493dd7b3ba860ba6531",
      tisId: "14",
      label: "GP Returner",
      curriculumSubType: null,
      status: null
    },
    {
      id: "5e9724a8dd7b3ba860ba6532",
      tisId: "31",
      label: "Geriatric Medicine",
      curriculumSubType: "MEDICAL_CURRICULUM",
      status: null
    }
  ],
  declarationType: [
    { id: "614b6140e0f4f2685df397c0", label: "Complaint" },
    { id: "614b6140e0f4f2685df397c1", label: "Other investigation" },
    { id: "614b6140e0f4f2685df397bf", label: "Significant event" }
  ],
  covidChangeCircs: [
    { id: "614b6140e0f4f2685df397ba", label: "Any Period of self-isolation" },
    {
      id: "614b6140e0f4f2685df397bb",
      label: "Limited opportunities to curricula requirements"
    }
  ]
};
