import dayjs from "dayjs";
import { CctCalculation } from "../redux/slices/cctSlice";

const changeStartDate = dayjs().format("YYYY-MM-DD");

export const mockCctList: CctCalculation[] = [
  {
    id: "6756c2b2-3c1f-4b8d-9e0a-5f6c7d8e9f0a",
    name: "bob1",
    programmeMembership: {
      id: "a6de88b8-de41-48dd-9492-a518f5001176",
      name: "Cardiology",
      startDate: "2020-01-01",
      endDate: "2028-01-01",
      wte: 1.0,
      designatedBodyCode: "WTF",
      managingDeanery: "North West"
    },
    changes: [
      {
        type: "LTFT",
        startDate: changeStartDate,
        wte: 0.7
      }
    ],
    cctDate: "2029-03-07",
    created: "2024-12-09T10:13:09.559Z",
    lastModified: "2024-12-09T15:11:04.100Z"
  },
  {
    id: "c96468cc-075c-4ac8-a5a2-1b53220a807e",
    name: "bob2",
    programmeMembership: {
      id: "93dae29a-fd44-4b59-8779-3e7d3d90b237",
      name: "Respiratory Medicine",
      startDate: "2024-08-07",
      endDate: "2029-07-31",
      wte: 1.0,
      designatedBodyCode: "WTF2",
      managingDeanery: "North East"
    },
    changes: [
      {
        type: "LTFT",
        startDate: changeStartDate,
        wte: 0.6
      }
    ],
    cctDate: "2032-06-20",
    created: "2025-01-20T10:13:09.559Z",
    lastModified: "2025-01-20T11:11:04.100Z"
  }
];

export const mockCctCalc: CctCalculation = {
  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  name: "My Programme - Hours Reduction",
  programmeMembership: {
    id: "a6de88b8-de41-48dd-9492-a518f5001176",
    name: "Cardiology",
    startDate: "2020-01-01",
    endDate: "2028-01-01",
    wte: 1.0,
    designatedBodyCode: "WTF3",
    managingDeanery: "North North West"
  },
  changes: [
    {
      type: "LTFT",
      startDate: "2027-01-01",
      wte: 0.8,
      id: "fc13458c-5b0b-442f-8907-6f9af8fc0ffb"
    }
  ],
  cctDate: "2028-04-02",
  created: "2024-12-09T10:13:09.559Z",
  lastModified: "2024-12-09T15:11:04.100Z"
};
