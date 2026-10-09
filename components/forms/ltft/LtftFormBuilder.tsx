import FormBuilder from "../form-builder/FormBuilder";
import { useFormContext } from "../form-builder/FormContext";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { selectPmsNotPast } from "../../../redux/slices/traineeProfileSlice";
import { findLtftRotationWindowUrl } from "../../../utilities/ltftUtilities";
import { LTFT_PROGRAMME_PAGE_NAME } from "../../../utilities/Constants";
import { LtftRotationWindowNotice } from "./LtftRotationWindowNotice";

type LtftFormBuilderProps = {
  options: any;
  validationSchema: any;
};

// Note: the rotation window notice reacts to the selected programme, so it has to be derived inside the FormProvider i.e. options built in LtftForm won't see the latest formData.
export function LtftFormBuilder({
  options,
  validationSchema
}: Readonly<LtftFormBuilderProps>) {
  const { formData } = useFormContext();
  const pmsNotPast = useAppSelector(selectPmsNotPast);
  const rotationWindowUrl = findLtftRotationWindowUrl(
    formData.pmId,
    pmsNotPast
  );

  return (
    <FormBuilder
      options={options}
      validationSchema={validationSchema}
      pageNotices={
        rotationWindowUrl
          ? {
              [LTFT_PROGRAMME_PAGE_NAME]: (
                <LtftRotationWindowNotice
                  rotationWindowUrl={rotationWindowUrl}
                />
              )
            }
          : undefined
      }
    />
  );
}
