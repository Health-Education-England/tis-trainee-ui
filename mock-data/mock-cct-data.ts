import { CctCalculation } from "../redux/slices/cctSlice";

export const mockCctList: CctCalculation[] = [
  {
    id: "6756c2b57ee98643d6f3dd8b",
    name: "bob1",
    programmeMembership: {
      id: "a6de88b8-de41-48dd-9492-a518f5001176",
      name: "Cardiology",
      startDate: "2020-01-01",
      endDate: "2028-01-01",
      wte: 1.0,
      designatedBodyCode: "WTF"
    },
    changes: [
      {
        type: "LTFT",
        startDate: "2025-04-01",
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
      id: "541",
      name: "Respiratory Medicine",
      startDate: "2024-08-07",
      endDate: "2029-07-31",
      wte: 1.0,
      designatedBodyCode: "WTF2"
    },
    changes: [
      {
        type: "LTFT",
        startDate: "2025-04-01",
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
    designatedBodyCode: "WTF3"
  },
  changes: [
    {
      type: "LTFT",
      startDate: "2027-01-01",
      wte: 0.8
    }
  ],
  cctDate: "2028-04-02",
  created: "2024-12-09T10:13:09.559Z",
  lastModified: "2024-12-09T15:11:04.100Z"
};
