import { Work } from "../models/FormRPartB";

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
      startDate: "2023-12-04",
      endDate: "2024-03-31",
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
      startDate: "2022-12-04",
      endDate: "2023-03-31",
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
      endDate: "2023-03-31",
      site: "Sheffield",
      siteLocation: "",
      startDate: "2022-12-04",
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
      endDate: "2023-04-30",
      site: "Sheffield",
      siteLocation: "",
      startDate: "2022-12-04",
      trainingPost: "",
      typeOfWork: ""
    }
  ];

export const trimmedAndSortedWorkArrWithTwoFutureOnSameDay = [
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
      endDate: "2023-04-30",
      site: "Sheffield",
      siteLocation: "",
      startDate: "2022-12-04",
      trainingPost: "",
      typeOfWork: ""
    },
    {
      endDate: "2023-03-31",
      site: "Sheffield",
      siteLocation: "",
      startDate: "2022-12-04",
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