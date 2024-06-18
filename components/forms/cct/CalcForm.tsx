import dayjs from "dayjs";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Button, CloseIcon } from "nhsuk-react-components";
import { AutocompleteSelect } from "../../common/AutocompleteSelect";
import TextInputField from "../TextInputField";
import FieldWarningMsg from "../FieldWarningMsg";
import {
  FtePercentsTypes,
  NewEndDatesTypes,
  handleClose
} from "../../../utilities/CctUtilities";

type CalcFormProps = {
  currentProgEndDate: string;
  propStartDate: string;
  onCalculate: (values: CalcFormValues) => void;
  newEndDates: NewEndDatesTypes[];
  handlePrint: () => void;
};

export type CalcFormValues = {
  ftePercents: FtePercentsTypes[];
  propStartDate: string;
  propEndDate: string;
  currentFtePercent: string;
};

export function CalcForm({
  currentProgEndDate,
  propStartDate,
  onCalculate,
  newEndDates = [],
  handlePrint
}: Readonly<CalcFormProps>) {
  const validationSchema = Yup.object().shape({
    currentFtePercent: Yup.string()
      .nullable()
      .required("Current WTE percentage is required.")
      .test("is-percent", "WTE must be a number between 1 and 100.", value => {
        if (value && value !== null && value !== "") {
          const numValue = Number(value.split("%")[0]);
          return numValue >= 1 && numValue <= 100;
        }
        return false;
      }),
    ftePercents: Yup.array()
      .min(1, "At least one WTE percentage is required.")
      .test("is-percent", "WTE must be a number between 1 and 100.", array => {
        if (array && array.length > 0) {
          const result = array.every((value: FtePercentsTypes) => {
            const numValue = Number(value.label.split("%")[0]);
            return numValue >= 1 && numValue <= 100;
          });
          return result;
        }
        return false;
      }),
    propStartDate: Yup.date()
      .min(dayjs().format("YYYY-MM-DD"), "Start date cannot be before today.")
      .when("propEndDate", (propEndDate, schema) => {
        return propEndDate
          ? schema.max(propEndDate, "Start date cannot be after end date.")
          : schema;
      })
      .required("Start date is required."),
    propEndDate: Yup.date()
      .max(
        currentProgEndDate,
        `End date cannot be after current programme end date ${dayjs(
          currentProgEndDate
        ).format("DD/MM/YYYY")}`
      )
      .required("End date is required.")
  });
  const fteOptions = [
    { value: 100, label: "100%" },
    { value: 80, label: "80%" },
    { value: 70, label: "70%" },
    { value: 60, label: "60%" },
    { value: 50, label: "50%" }
  ];
  const minPropStart = dayjs().subtract(1, "day");
  const sixteenWkCriteria = dayjs().add(16, "weeks").subtract(1, "day");

  return (
    <Formik
      initialValues={{
        currentFtePercent: "100%",
        ftePercents: [],
        propStartDate: propStartDate,
        propEndDate: currentProgEndDate
      }}
      validationSchema={validationSchema}
      onSubmit={values => {
        onCalculate(values);
      }}
    >
      {({ values, errors, setFieldValue, dirty, isValid }) => (
        <Form>
          <div>
            <label htmlFor="currentFtePercent" className="nhsuk-label">
              What is your current WTE percentage?
            </label>
            <AutocompleteSelect
              value={values.currentFtePercent}
              onChange={setFieldValue}
              error={errors.currentFtePercent}
              options={fteOptions}
              name="currentFtePercent"
              label=""
              isMulti={false}
              closeMenuOnSelect={true}
              isCreatable={true}
            />
          </div>
          <div>
            <label htmlFor="ftePercents" className="nhsuk-label">
              What WTE percentage(s) are you considering?
            </label>
            <AutocompleteSelect
              value={values.ftePercents}
              onChange={setFieldValue}
              error={errors.ftePercents}
              options={fteOptions.filter(
                option => option.label !== values.currentFtePercent
              )}
              name="ftePercents"
              label=""
              isMulti={true}
              closeMenuOnSelect={false}
              isCreatable={true}
            />
          </div>
          {values.ftePercents.some(
            (option: FtePercentsTypes) => option.value === 100
          ) &&
            values.currentFtePercent !== "100%" && (
              <span data-cy="ft-return-warn">
                <FieldWarningMsg warningMsg="Returning to 100% WTE might not be possible. See 'CCT Calculator further information' above." />
              </span>
            )}
          {values.ftePercents.some(
            (option: FtePercentsTypes) =>
              !fteOptions.some(fteOption => fteOption.value === option.value)
          ) && (
            <span data-cy="bespoke-wte-warn">
              <FieldWarningMsg warningMsg="A bespoke WTE percentage might not be possible. See 'CCT Calculator further information' above." />
            </span>
          )}

          <TextInputField
            label="When should the WTE change begin?"
            type="date"
            name="propStartDate"
            width={10}
          />
          {dayjs(values.propStartDate).isBetween(
            minPropStart,
            sixteenWkCriteria
          ) && (
            <span data-cy="start-date-warn">
              <FieldWarningMsg warningMsg="This Start Date might not be possible. See 'CCT Calculator further information' above." />
            </span>
          )}
          <TextInputField
            label="When should the WTE change end?"
            type="date"
            name="propEndDate"
            width={10}
          />
          <div id="cct-btns">
            <Button
              type="submit"
              disabled={!dirty || !isValid}
              data-cy="cct-calc-btn"
            >
              Calculate
            </Button>
            <Button
              secondary
              onClick={handlePrint}
              disabled={!dirty || !isValid || newEndDates.length === 0}
              data-cy="cct-pdf-btn"
            >
              Save PDF
            </Button>
            <Button
              reverse
              type="button"
              onClick={handleClose}
              title="Close"
              data-cy="cct-close-btn"
            >
              <CloseIcon />
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
