import dayjs from "dayjs";
import { CctCalculation } from "../redux/slices/cctSlice";
import { calcCctDate } from "../utilities/CctUtilities";

// mockCctList[0] cct data -----------------
const pmStartDate1 = dayjs().subtract(2, "year").format("YYYY-MM-DD");
const pmEndDate1 = dayjs().add(2, "year").format("YYYY-MM-DD");
const wteBeforeChange1 = 1;
const wte1 = 0.7;
const startDate1 = dayjs().add(16, "week").format("YYYY-MM-DD");

const cctDate1 = calcCctDate(pmEndDate1, wteBeforeChange1, wte1, startDate1);
// -----------------------------------------

// mockCctList[1] cct data -----------------
const pmStartDate2 = dayjs().subtract(3, "year").format("YYYY-MM-DD");
const pmEndDate2 = dayjs().add(5, "year").format("YYYY-MM-DD");
const wteBeforeChange2 = 0.5;
const wte2 = 0.8;
const startDate2 = dayjs().add(15, "week").format("YYYY-MM-DD");

const cctDate2 = calcCctDate(pmEndDate2, wteBeforeChange2, wte2, startDate2);
// -----------------------------------------

// mockCctCalc data -----------------
const pmStartDate = dayjs().subtract(6, "year").format("YYYY-MM-DD");
const pmEndDate = dayjs().add(2, "year").format("YYYY-MM-DD");
const wteBeforeChange = 1;
const wte = 0.8;
const startDate = dayjs().add(20, "week").format("YYYY-MM-DD");

const cctDate = calcCctDate(pmEndDate, wteBeforeChange, wte, startDate);
// -----------------------------------------

export const mockCctList: CctCalculation[] = [
  {
    id: "6756c2b2-3c1f-4b8d-9e0a-5f6c7d8e9f0a",
    name: "bob1",
    programmeMembership: {
      id: "a6de88b8-de41-48dd-9492-a518f5001176",
      name: "Cardiology",
      startDate: pmStartDate1,
      endDate: pmEndDate1,
      wte: wteBeforeChange1,
      designatedBodyCode: "WTF",
      managingDeanery: "North West"
    },
    changes: [
      {
        type: "LTFT",
        startDate: startDate1,
        wte: wte1
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
      id: "93dae29a-fd44-4b59-8779-3e7d3d90b237",
      name: "Respiratory Medicine",
      startDate: pmStartDate2,
      endDate: pmEndDate2,
      wte: wteBeforeChange2,
      designatedBodyCode: "WTF2",
      managingDeanery: "North East"
    },
    changes: [
      {
        type: "LTFT",
        startDate: startDate1,
        wte: wte2
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
    id: "a6de88b8-de41-48dd-9492-a518f5001176",
    name: "Cardiology",
    startDate: pmStartDate,
    endDate: pmEndDate,
    wte: wteBeforeChange,
    designatedBodyCode: "WTF3",
    managingDeanery: "North North West"
  },
  changes: [
    {
      type: "LTFT",
      startDate: startDate,
      wte: wte,
      id: "fc13458c-5b0b-442f-8907-6f9af8fc0ffb"
    }
  ],
  cctDate: cctDate,
  created: "2024-12-09T10:13:09.559Z",
  lastModified: "2024-12-09T15:11:04.100Z"
};
