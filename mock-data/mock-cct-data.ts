import { CctCalculation } from "../redux/slices/cctSlice";

type CctSummaryType = {
  id: string;
  name: string;
  programmeMembershipId: string;
  created: Date | string;
  lastModified: Date | string;
};

export const cctSummaryList: CctSummaryType[] = [
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    name: "UserChosenName1",
    programmeMembershipId: "123e4567-e89b-12d3-a456-426614174001",
    created: "2023-01-01T00:00:00Z",
    lastModified: "2023-01-02T00:00:00Z"
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174002",
    name: "UserChosenName2",
    programmeMembershipId: "123e4567-e89b-12d3-a456-426614174003",
    created: "2023-02-01T00:00:00Z",
    lastModified: "2023-02-02T00:00:00Z"
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174004",
    name: "UserChosenName3",
    programmeMembershipId: "123e4567-e89b-12d3-a456-426614174005",
    created: "2023-03-01T00:00:00Z",
    lastModified: "2023-03-02T00:00:00Z"
  }
];

export const mockCctCalcData1: CctCalculation = {
  id: "6756c2b57ee98643d6f3dd8b",
  name: "bob1",
  programmeMembership: {
    id: "a6de88b8-de41-48dd-9492-a518f5001176",
    name: "Cardiology",
    startDate: "2020-01-01",
    endDate: "2028-01-01",
    wte: 1.0
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
};
