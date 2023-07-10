import { Work } from "../models/FormRPartB";
import dayjs from "dayjs";
import { DateUtilities } from "../utilities/DateUtilities";

const futureStart1 = DateUtilities.ToUTCDate(
  dayjs().add(2, "years").toString()
);
const futureEnd1 = DateUtilities.ToUTCDate(
  dayjs(futureStart1).add(1, "year").toString()
);
const futureStart2 = DateUtilities.ToUTCDate(
  dayjs(futureStart1).add(5, "years").toString()
);
const futureEnd2 = DateUtilities.ToUTCDate(
  dayjs(futureStart2).add(1, "year").toString()
);

export const workArr: Work[] = [
  {
    startDate: "2018-08-01",
    endDate: "2019-03-04",
    site: "Blackpool",
    typeOfWork: "",
    trainingPost: "",
    siteLocation: ""
  },
  {
    startDate: "2018-12-05",
    endDate: "2019-04-02",
    site: "Liverpool",
    typeOfWork: "",
    trainingPost: "",
    siteLocation: ""
  },
  {
    startDate: futureStart1,
    endDate: futureEnd1,
    site: "Everton",
    typeOfWork: "",
    trainingPost: "",
    siteLocation: ""
  },
  {
    startDate: "2021-12-04",
    endDate: "2024-03-31",
    site: "London",
    typeOfWork: "",
    trainingPost: "",
    siteLocation: ""
  },
  {
    startDate: futureStart2,
    endDate: futureEnd2,
    site: "Sheffield",
    typeOfWork: "",
    trainingPost: "",
    siteLocation: ""
  },
  {
    startDate: "2021-12-04",
    endDate: "2024-03-31",
    site: "Leicester",
    typeOfWork: "",
    trainingPost: "",
    siteLocation: ""
  }
];

export const trimmedAndSortedArr = [
  {
    endDate: futureEnd1,
    site: "Everton",
    siteLocation: "",
    startDate: futureStart1,
    trainingPost: "",
    typeOfWork: ""
  },
  {
    endDate: "2024-03-31",
    site: "London",
    siteLocation: "",
    startDate: "2021-12-04",
    trainingPost: "",
    typeOfWork: ""
  },
  {
    endDate: "2024-03-31",
    site: "Leicester",
    siteLocation: "",
    startDate: "2021-12-04",
    trainingPost: "",
    typeOfWork: ""
  },
  {
    endDate: "2019-04-02",
    site: "Liverpool",
    siteLocation: "",
    startDate: "2018-12-05",
    trainingPost: "",
    typeOfWork: ""
  },
  {
    endDate: "2019-03-04",
    site: "Blackpool",
    siteLocation: "",
    startDate: "2018-08-01",
    trainingPost: "",
    typeOfWork: ""
  }
];

export const workArrWithTwoFutureOnSameDay = [
  ...workArr,
  {
    endDate: futureEnd1,
    site: "Sheffield",
    siteLocation: "",
    startDate: futureStart1,
    trainingPost: "",
    typeOfWork: ""
  }
];

export const trimmedAndSortedWorkArrWithTwoFutureOnSameDay = [
  {
    endDate: futureEnd1,
    site: "Everton",
    siteLocation: "",
    startDate: futureStart1,
    trainingPost: "",
    typeOfWork: ""
  },
  {
    endDate: futureEnd1,
    site: "Sheffield",
    siteLocation: "",
    startDate: futureStart1,
    trainingPost: "",
    typeOfWork: ""
  },
  {
    endDate: "2024-03-31",
    site: "London",
    siteLocation: "",
    startDate: "2021-12-04",
    trainingPost: "",
    typeOfWork: ""
  },
  {
    endDate: "2024-03-31",
    site: "Leicester",
    siteLocation: "",
    startDate: "2021-12-04",
    trainingPost: "",
    typeOfWork: ""
  },
  {
    endDate: "2019-04-02",
    site: "Liverpool",
    siteLocation: "",
    startDate: "2018-12-05",
    trainingPost: "",
    typeOfWork: ""
  },
  {
    endDate: "2019-03-04",
    site: "Blackpool",
    siteLocation: "",
    startDate: "2018-08-01",
    trainingPost: "",
    typeOfWork: ""
  }
];

export const workPlacementsForARCP: Work[] = [
  {
    typeOfWork: "Type 1",
    startDate: "2023-07-01",
    endDate: "2023-08-15",
    trainingPost: "Post 1",
    site: "Site 1",
    siteLocation: "Location 1"
  },
  {
    typeOfWork: "Type 2",
    startDate: "2023-08-02",
    endDate: "2023-09-10",
    trainingPost: "Post 2",
    site: "Site 2",
    siteLocation: "Location 2"
  },
  {
    typeOfWork: "Type 3",
    startDate: "2023-08-10",
    endDate: "2023-08-20",
    trainingPost: "Post 3",
    site: "Site 3",
    siteLocation: "Location 3"
  },
  {
    typeOfWork: "Type 4",
    startDate: "2024-08-07",
    endDate: "2025-08-20",
    trainingPost: "Post 4",
    site: "Site 4",
    siteLocation: "Location 4"
  },
  {
    typeOfWork: "Type 5",
    startDate: "2020-08-10",
    endDate: "2025-08-20",
    trainingPost: "Post 5",
    site: "Site 5",
    siteLocation: "Location 5"
  }
];
