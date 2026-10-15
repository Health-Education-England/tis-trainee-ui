import { Field } from "../form-builder/FormBuilder";
import {
  CCT_CHANGE_TYPE_LABELS,
  CCT_OPTIONAL_CREDIT_TYPES,
  CCT_SPECIALTIES,
  CCT_TRAINING_GRADES,
  CCT_WTE_TYPES
} from "../../../utilities/CctConstants";

const showWhenTrue = (fieldName: string) => ({
  field: fieldName,
  matcher: "valueInList" as const,
  values: [true]
});

export const cctSpecialtyFields: Field[] = [
  {
    name: "specialty",
    label: "Specialty",
    type: "select",
    visible: true,
    optionsKey: "specialties",
    placeholder: "Select your specialty",
    hint: "The programme length and start grade are defaulted from your specialty."
  }
];

// Note: these stay hidden until a specialty is chosen, because their defaults come from it.
export const cctProgrammeRemainingFields: Field[] = [
  {
    name: "lengthMonths",
    label: "Programme length (months)",
    type: "text",
    visible: true,
    readOnly: true,
    width: 3
  },
  {
    name: "startDate",
    label: "Programme start date",
    type: "date",
    visible: true
  },
  {
    name: "startGrade",
    label: "Start grade",
    type: "select",
    visible: true,
    optionsKey: "trainingGrades",
    hint: "Defaulted from your specialty. Change it if you entered your programme at a different grade."
  },
  {
    // Note: revealed by the derived startGradeOverridden flag, not by a checkbox - see CctProgrammeDetailsForm.
    name: "startGradeOverrideNotes",
    label: "Reason for a different start grade",
    type: "text",
    visible: false,
    visibleIf: showWhenTrue("startGradeOverridden"),
    placeholder: "e.g. Entering programme at ST4",
    width: 30
  },
  {
    name: "hasAdditionalTraining",
    label: "Add additional training time",
    type: "checkbox",
    visible: true
  },
  {
    name: "additionalMonths",
    label: "Additional training time (months)",
    type: "text",
    visible: false,
    visibleIf: showWhenTrue("hasAdditionalTraining"),
    isNumberField: true,
    maxDigits: 2,
    width: 3,
    hint: "For example, additional time required following an ARCP outcome. Enter up to 24 months."
  },
  {
    name: "additionalMonthsNotes",
    label: "Reason for additional training time",
    type: "text",
    visible: false,
    visibleIf: showWhenTrue("hasAdditionalTraining"),
    placeholder: "e.g. Outcome 3 following ARCP",
    width: 30
  },
  {
    name: "hasAcceleratedTraining",
    label: "Add accelerated training time (reduce programme length)",
    type: "checkbox",
    visible: true
  },
  {
    name: "acceleratedMonths",
    label: "Accelerated training time (months)",
    type: "text",
    visible: false,
    visibleIf: showWhenTrue("hasAcceleratedTraining"),
    isNumberField: true,
    maxDigits: 2,
    width: 3,
    hint: "For example, recognised prior learning that reduces the remaining training requirement. Enter up to 12 months."
  },
  {
    name: "acceleratedMonthsNotes",
    label: "Reason for accelerated training time",
    type: "text",
    visible: false,
    visibleIf: showWhenTrue("hasAcceleratedTraining"),
    placeholder: "e.g. Recognised prior learning",
    width: 30
  },
  {
    name: "hasEighteenMonthFinalYear",
    label: "Set an 18-month final year",
    type: "checkbox",
    visible: true
  },
  {
    name: "eighteenMonthFinalGrade",
    label: "Final grade lasting 18 months",
    type: "select",
    visible: false,
    visibleIf: showWhenTrue("hasEighteenMonthFinalYear"),
    optionsKey: "trainingGrades",
    hint: "For specialties with an 18-month final year, for example intensive care medicine with a dual specialty. This changes grade progression, not total training time."
  },
  {
    name: "eighteenMonthFinalGradeNotes",
    label: "Reason for an 18-month final year",
    type: "text",
    visible: false,
    visibleIf: showWhenTrue("hasEighteenMonthFinalYear"),
    placeholder: "e.g. ICM dual-specialty final year",
    width: 30
  },
  {
    name: "hasSkippedGrade",
    label: "Skip one grade year",
    type: "checkbox",
    visible: true
  },
  {
    name: "skippedGrade",
    label: "Grade year to skip",
    type: "select",
    visible: false,
    visibleIf: showWhenTrue("hasSkippedGrade"),
    optionsKey: "trainingGrades",
    hint: "This moves later displayed grades on by one year. Record any shorter programme duration separately as accelerated training time."
  },
  {
    name: "skippedGradeNotes",
    label: "Reason for skipping a grade year",
    type: "text",
    visible: false,
    visibleIf: showWhenTrue("hasSkippedGrade"),
    placeholder: "e.g. Progression from ST1 to ST3 after core competencies",
    width: 30
  }
];

export const cctProgrammeDetailsFields: Field[] = [
  ...cctSpecialtyFields,
  ...cctProgrammeRemainingFields
];

export const cctChangeFields: Field[] = [
  {
    name: "type",
    label: "Change type",
    type: "select",
    visible: true,
    optionsKey: "changeTypes",
    placeholder: "Select a change type"
  },
  {
    // Note: only LTFT can run to completion, so only LTFT is offered the choice (a non-counting period can never contain the completion date).
    name: "ltftDuration",
    label: "How long does this LTFT change last?",
    type: "radio",
    visible: false,
    visibleIf: {
      field: "type",
      matcher: "valueInList",
      values: ["LTFT"]
    },
    optionsKey: "ltftDurations"
  },
  {
    name: "startDate",
    label: "Start date",
    type: "date",
    visible: true
  },
  {
    // Note: revealed by the derived showEndDate flag - visibleIf tests one field, and this depends on both type and ltftDuration.
    name: "endDate",
    label: "End date",
    type: "date",
    visible: false,
    visibleIf: showWhenTrue("showEndDate")
  },
  {
    name: "wtePercent",
    label: "WTE (%)",
    type: "text",
    visible: false,
    visibleIf: {
      field: "type",
      matcher: "valueInList",
      values: CCT_WTE_TYPES
    },
    isNumberField: true,
    maxDigits: 3,
    width: 3,
    hint: "For LTFT, your working pattern as a percentage of full time (1-99). For OOPR, the proportion of the period approved to count towards CCT."
  },
  {
    name: "countsTowardsCompletion",
    label: "This period counts towards completion of training",
    type: "checkbox",
    visible: false,
    visibleIf: {
      field: "type",
      matcher: "valueInList",
      values: CCT_OPTIONAL_CREDIT_TYPES
    }
  },
  {
    name: "notes",
    label: "Notes (optional)",
    type: "text",
    visible: true,
    placeholder: "e.g. Cardiology, St Mary's",
    width: 30
  }
];

export const cctFieldOptions = {
  specialties: CCT_SPECIALTIES.map(specialty => ({
    value: specialty.name,
    label: specialty.name
  })),
  trainingGrades: CCT_TRAINING_GRADES.map(grade => ({
    value: grade,
    label: grade
  })),
  changeTypes: Object.entries(CCT_CHANGE_TYPE_LABELS)
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label)),
  ltftDurations: [
    { value: "END_DATE", label: "It ends on a specific date" },
    { value: "REMAINDER", label: "It lasts for the rest of my training" }
  ]
};
