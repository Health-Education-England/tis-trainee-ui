import dayjs from "dayjs";
import { CctCalculation } from "../redux/slices/cctSlice";
import { calcCctDate, calcCctExtension } from "../utilities/CctUtilities";

// mockCctList[0] cct data -----------------
const pmStartDate1 = "2020-01-01";
const pmEndDate1 = dayjs().add(3, "year").format("YYYY-MM-DD");
const wte1 = 0.7;
const startDate1 = dayjs().add(16, "week").format("YYYY-MM-DD");

const cctDate1 = calcCctDate(pmEndDate1, startDate1, pmEndDate1, wte1);
const daysAdded1 = calcCctExtension(startDate1, pmEndDate1, wte1);
// -----------------------------------------

// mockCctList[1] cct data -----------------
const pmStartDate2 = "2022-01-01";
const pmEndDate2 = dayjs().add(4, "year").format("YYYY-MM-DD");
const wte2 = 0.5;
const startDate2 = dayjs().add(15, "week").format("YYYY-MM-DD");

const cctDate2 = calcCctDate(pmEndDate2, startDate2, pmEndDate2, wte2);
const daysAdded2 = calcCctExtension(startDate2, pmEndDate2, wte2);
// -----------------------------------------

// mockCctCalc data -----------------
const pmStartDate = dayjs().subtract(6, "year").format("YYYY-MM-DD");
const pmEndDate = dayjs().add(2, "year").format("YYYY-MM-DD");
const wte = 0.8;
const startDate = dayjs().add(20, "week").format("YYYY-MM-DD");

const cctDate = calcCctDate(pmEndDate, startDate, pmEndDate, wte);
const daysAdded = calcCctExtension(startDate, pmEndDate, wte);
// -----------------------------------------

export const mockCctList: CctCalculation[] = [
  {
    id: "6756c2b2-3c1f-4b8d-9e0a-5f6c7d8e9f0a",
    name: "bob1",
    programmeMembership: {
      id: "7ab1aae3-83c2-4bb6-b1f3-99146e79b362",
      name: "Cardiology",
      startDate: pmStartDate1,
      endDate: pmEndDate1,
      wte: 1,
      designatedBodyCode: "WTF",
      managingDeanery: "North West"
    },
    changes: [
      {
        type: "LTFT",
        startDate: startDate1,
        endDate: pmEndDate1,
        wte: wte1,
        daysAdded: daysAdded1,
        resultingCctDate: cctDate1
      }
    ],
    cctDate: cctDate1,
    created: "2024-12-09T10:13:09.559Z",
    lastModified: "2024-12-09T15:11:04.100Z"
  },
  {
    id: "c96468cc-075c-4ac8-a5a2-1b53220a807e",
    name: "bob2",
    programmeMembership: {
      id: "2",
      name: "General Practice",
      startDate: pmStartDate2,
      endDate: pmEndDate2,
      wte: 0.5,
      designatedBodyCode: "WTF2",
      managingDeanery: "North East"
    },
    changes: [
      {
        type: "LTFT",
        startDate: startDate1,
        endDate: pmEndDate2,
        wte: wte2,
        daysAdded: daysAdded2,
        resultingCctDate: cctDate2
      }
    ],
    cctDate: cctDate2,
    created: "2025-01-20T10:13:09.559Z",
    lastModified: "2025-01-20T11:11:04.100Z"
  }
];

export const mockCctCalc: CctCalculation = {
  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  name: "My Programme - Hours Reduction",
  programmeMembership: {
    id: "7ab1aae3-83c2-4bb6-b1f3-99146e79b362",
    name: "Cardiology",
    startDate: pmStartDate,
    endDate: pmEndDate,
    wte: 1,
    designatedBodyCode: "WTF3",
    managingDeanery: "North North West"
  },
  changes: [
    {
      type: "LTFT",
      startDate: startDate,
      endDate: pmEndDate,
      wte: wte,
      id: "fc13458c-5b0b-442f-8907-6f9af8fc0ffb",
      daysAdded: daysAdded,
      resultingCctDate: cctDate
    }
  ],
  cctDate: cctDate,
  created: "2024-12-09T10:13:09.559Z",
  lastModified: "2024-12-09T15:11:04.100Z"
};
