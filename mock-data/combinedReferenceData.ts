import { CombinedReferenceData } from "../models/CombinedReferenceData";

export const mockedCombinedReference: CombinedReferenceData = {
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
      label: "East of England",
      type: "LETB/Deanery",
      internal: true
    },
    {
      id: "5e7c8df62523bc1554f1ce81",
      tisId: "8",
      label: "South London",
      type: "LETB/Deanery",
      internal: true
    },
    {
      id: "5e7c8df62523bc1554f1ce80",
      tisId: "5",
      label: "Thames Valley",
      type: "LETB/Deanery",
      internal: true
    },
    {
      id: "5e7c8dc32523bc1554f1ce7d",
      tisId: "1",
      label: "Wessex",
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
      label: "East of England"
    },
    {
      id: "5e7c8df62523bc1554f1ce81",
      tisId: "8",
      label: "South London"
    },
    {
      id: "5e7c8df62523bc1554f1ce80",
      tisId: "5",
      label: "Thames Valley"
    },
    {
      id: "5e7c8dc32523bc1554f1ce7d",
      tisId: "1",
      label: "Wessex"
    },
    {
      id: "5e7c8df62523bc1554f1ce7f",
      tisId: "15",
      label: "Northern Ireland Medical and Dental Training Agency"
    },
    {
      id: "345454h545h4545h4545h45fce",
      tisId: "14",
      label: "London LETBs"
    },
    {
      id: "45fce4748374474949444749e7f",
      tisId: "15",
      label: "Defence Postgraduate Medical Deanery"
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
    },
    {
      id: "614b612cdf97ed1355c73a0d",
      tisId: "1",
      label: "Refugee in the UK"
    }
  ],
  curriculum: [
    {
      id: "5e9724c1dd7b3ba860ba6533",
      tisId: "33",
      label: "ACCS Anaesthetics",
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
    },
    {
      id: "614b6140e0f4f2685df397bc",
      label: "Other"
    }
  ],
  programmeMembershipType: [
    { id: "1", label: "Military" },
    { id: "2", label: "Substantive" }
  ]
};

export const mockTransformedCombinedReferenceData: CombinedReferenceData = {
  college: [
    {
      label: "Faculty Of Dental Surgery",
      value: "Faculty Of Dental Surgery"
    },
    {
      label: "Faculty of Intensive Care Medicine",
      value: "Faculty of Intensive Care Medicine"
    },
    {
      label: "Faculty of Occupational Medicine",
      value: "Faculty of Occupational Medicine"
    }
  ],
  covidChangeCircs: [
    {
      label: "Any Period of self-isolation",
      value: "Any Period of self-isolation"
    },
    {
      label: "Limited opportunities to curricula requirements",
      value: "Limited opportunities to curricula requirements"
    },
    {
      label: "Other",
      value: "Other"
    }
  ],
  curriculum: [
    {
      label: "ACCS Anaesthetics",
      value: "ACCS Anaesthetics"
    },
    {
      label: "GP Returner",
      value: "GP Returner"
    },
    {
      label: "Geriatric Medicine",
      value: "Geriatric Medicine"
    }
  ],
  dbc: [
    {
      label: "Centre for Health and Disability Assessments (Maximus UK)",
      value: "Centre for Health and Disability Assessments (Maximus UK)"
    },
    {
      label: "Cheshire and Wirral Partnership NHS Foundation Trust",
      value: "Cheshire and Wirral Partnership NHS Foundation Trust"
    },
    {
      label: "East of England",
      value: "East of England"
    },
    {
      label: "South London",
      value: "South London"
    },
    {
      label: "Thames Valley",
      value: "Thames Valley"
    },
    {
      label: "Wessex",
      value: "Wessex"
    },
    {
      label: "Northern Ireland Medical and Dental Training Agency",
      value: "Northern Ireland Medical and Dental Training Agency"
    },
    {
      label: "Sarnia Yachts Management (UK) Limited",
      value: "Sarnia Yachts Management (UK) Limited"
    }
  ],
  declarationType: [
    {
      label: "Complaint",
      value: "Complaint"
    },
    {
      label: "Other investigation",
      value: "Other investigation"
    },
    {
      label: "Significant event",
      value: "Significant event"
    }
  ],
  gender: [
    {
      label: "Female",
      value: "Female"
    },
    {
      label: "I prefer not to specify",
      value: "I prefer not to specify"
    },
    {
      label: "Male",
      value: "Male"
    }
  ],
  grade: [
    {
      label: "Core Training Year 2",
      value: "Core Training Year 2"
    },
    {
      label: "Core Training Year 3",
      value: "Core Training Year 3"
    },
    {
      label: "Foundation Year 1",
      value: "Foundation Year 1"
    },
    {
      label: "Specialty Training Year 6",
      value: "Specialty Training Year 6"
    }
  ],
  immigrationStatus: [
    {
      label: "British National Overseas",
      value: "British National Overseas"
    },
    {
      label:
        "Other immigration categories i.e. overseas government employees, innovators etc.",
      value:
        "Other immigration categories i.e. overseas government employees, innovators etc."
    },
    {
      label: "You are the partner/civil partner/spouse of a UK/EEA national",
      value: "You are the partner/civil partner/spouse of a UK/EEA national"
    },
    {
      label: "Refugee in the UK",
      value: "Refugee in the UK"
    }
  ],
  localOffice: [
    {
      label: "East of England",
      value: "East of England"
    },
    {
      label: "South London",
      value: "South London"
    },
    {
      label: "Thames Valley",
      value: "Thames Valley"
    },
    {
      label: "Wessex",
      value: "Wessex"
    },
    {
      label: "Northern Ireland Medical and Dental Training Agency",
      value: "Northern Ireland Medical and Dental Training Agency"
    },
    {
      label: "London LETBs",
      value: "London LETBs"
    },
    {
      label: "Defence Postgraduate Medical Deanery",
      value: "Defence Postgraduate Medical Deanery"
    }
  ],
  programmeMembershipType: [
    {
      label: "Military",
      value: "Military"
    },
    {
      label: "Substantive",
      value: "Substantive"
    }
  ]
};
