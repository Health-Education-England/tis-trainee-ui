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
    siteLocation: "",
    siteKnownAs: "Blackpool (code)"
  },
  {
    startDate: "2018-12-05",
    endDate: "2019-04-02",
    site: "Liverpool",
    typeOfWork: "",
    trainingPost: "",
    siteLocation: "",
    siteKnownAs: "Liverpool (code)"
  },
  {
    startDate: futureStart1,
    endDate: futureEnd1,
    site: "Everton",
    typeOfWork: "",
    trainingPost: "",
    siteLocation: "",
    siteKnownAs: "Everton (code)"
  },
  {
    startDate: "2021-12-04",
    endDate: "2024-03-31",
    site: "London",
    typeOfWork: "",
    trainingPost: "",
    siteLocation: "",
    siteKnownAs: "London (code)"
  },
  {
    startDate: futureStart2,
    endDate: futureEnd2,
    site: "Sheffield",
    typeOfWork: "",
    trainingPost: "",
    siteLocation: "",
    siteKnownAs: "Sheffield (code)"
  },
  {
    startDate: "2021-12-04",
    endDate: "2024-03-31",
    site: "Leicester",
    typeOfWork: "",
    trainingPost: "",
    siteLocation: "",
    siteKnownAs: "Leicester (code)"
  }
];

export const trimmedAndSortedArr = [
  {
    endDate: futureEnd1,
    site: "Everton",
    siteLocation: "",
    siteKnownAs: "Everton (code)",
    startDate: futureStart1,
    trainingPost: "",
    typeOfWork: ""
  },
  {
    endDate: "2024-03-31",
    site: "London",
    siteLocation: "",
    siteKnownAs: "London (code)",
    startDate: "2021-12-04",
    trainingPost: "",
    typeOfWork: ""
  },
  {
    endDate: "2024-03-31",
    site: "Leicester",
    siteLocation: "",
    siteKnownAs: "Leicester (code)",
    startDate: "2021-12-04",
    trainingPost: "",
    typeOfWork: ""
  },
  {
    endDate: "2019-04-02",
    site: "Liverpool",
    siteLocation: "",
    siteKnownAs: "Liverpool (code)",
    startDate: "2018-12-05",
    trainingPost: "",
    typeOfWork: ""
  },
  {
    endDate: "2019-03-04",
    site: "Blackpool",
    siteLocation: "",
    siteKnownAs: "Blackpool (code)",
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
    siteKnownAs: "Sheffield (code)",
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
    siteKnownAs: "Everton (code)",
    startDate: futureStart1,
    trainingPost: "",
    typeOfWork: ""
  },
  {
    endDate: futureEnd1,
    site: "Sheffield",
    siteLocation: "",
    siteKnownAs: "Sheffield (code)",
    startDate: futureStart1,
    trainingPost: "",
    typeOfWork: ""
  },
  {
    endDate: "2024-03-31",
    site: "London",
    siteLocation: "",
    siteKnownAs: "London (code)",
    startDate: "2021-12-04",
    trainingPost: "",
    typeOfWork: ""
  },
  {
    endDate: "2024-03-31",
    site: "Leicester",
    siteLocation: "",
    siteKnownAs: "Leicester (code)",
    startDate: "2021-12-04",
    trainingPost: "",
    typeOfWork: ""
  },
  {
    endDate: "2019-04-02",
    site: "Liverpool",
    siteLocation: "",
    siteKnownAs: "Liverpool (code)",
    startDate: "2018-12-05",
    trainingPost: "",
    typeOfWork: ""
  },
  {
    endDate: "2019-03-04",
    site: "Blackpool",
    siteLocation: "",
    siteKnownAs: "Blackpool (code)",
    startDate: "2018-08-01",
    trainingPost: "",
    typeOfWork: ""
  }
];
