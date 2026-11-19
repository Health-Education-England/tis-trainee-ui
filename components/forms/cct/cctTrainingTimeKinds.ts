import {
  CCT_MAX_ACCELERATED_MONTHS,
  CCT_MAX_ADDITIONAL_MONTHS
} from "../../../utilities/CctConstants";

export type CctTrainingTimeKind = {
  field: "additionalTrainingTime" | "acceleratedTrainingTime";
  label: "additional" | "accelerated";
  title: string;
  timeHeading: string;
  maxTotalMonths: number;
  intro: string;
  gradeHint: string;
  reasonPlaceholder: string;
};

export const CCT_ADDITIONAL_TIME: CctTrainingTimeKind = {
  field: "additionalTrainingTime",
  label: "additional",
  title: "Additional training time",
  timeHeading: "Additional time",
  maxTotalMonths: CCT_MAX_ADDITIONAL_MONTHS,
  intro: `Record any extra training time you have been given, for example after an ARCP outcome 3, against the grade it applies to. It moves that grade's end date and every later grade on. You can add time to as many grades as you need, up to ${CCT_MAX_ADDITIONAL_MONTHS} months in total.`,
  gradeHint: "The grade the additional time was given in.",
  reasonPlaceholder: "e.g. Outcome 3 following ARCP"
};

export const CCT_ACCELERATED_TIME: CctTrainingTimeKind = {
  field: "acceleratedTrainingTime",
  label: "accelerated",
  title: "Accelerated training time",
  timeHeading: "Accelerated time",
  maxTotalMonths: CCT_MAX_ACCELERATED_MONTHS,
  intro: `Record any approved reduction in training time, for example for recognised prior learning, against the grade it applies to. It brings that grade's end date and every later grade forward. You can take time off as many grades as you need, up to ${CCT_MAX_ACCELERATED_MONTHS} months in total.`,
  gradeHint: "The grade the time is taken off.",
  reasonPlaceholder: "e.g. Recognised prior learning"
};

export const CCT_TRAINING_TIME_KINDS = [
  CCT_ADDITIONAL_TIME,
  CCT_ACCELERATED_TIME
];
