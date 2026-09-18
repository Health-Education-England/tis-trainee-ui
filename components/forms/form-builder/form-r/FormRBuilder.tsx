import { useEffect, useRef } from "react";
import FormBuilder from "../FormBuilder";
import { useFormContext } from "../FormContext";
import { useAppSelector } from "../../../../redux/hooks/hooks";
import { selectTraineeProfile } from "../../../../redux/slices/traineeProfileSlice";
import {
  hasStaleLinkage,
  resolveLinkedProgrammeFields
} from "../../../../utilities/FormRUtilities";
import { useLinkageOptions } from "../../../../utilities/hooks/useLinkageOptions";
import { InsetText } from "nhsuk-react-components";
import {
  formRNoLinkageOptionsNotice,
  formRNoProgrammesNotice,
  formRPrefillNotice,
  PROG_LINK_PAGE_NAME
} from "../../../../utilities/Constants";
import { useLocation } from "react-router-dom";

type FormRBuilderProps = {
  options: any;
  validationSchema: any;
};

// Note: moved linkage options logic here so the filtered programme options can react to the change in isArcp i.e. options built in useFormRConfig won't see the latest formData.
export function FormRBuilder({
  options,
  validationSchema
}: Readonly<FormRBuilderProps>) {
  const { formData, setFormData } = useFormContext();
  const programmesArr =
    useAppSelector(selectTraineeProfile).programmeMemberships;

  const isArcp = formData.isArcp;
  const programmeMembershipId = formData.programmeMembershipId;
  const lifecycleState = formData.lifecycleState;
  const { arcpOptions, linkedProgrammeOptions } = useLinkageOptions(isArcp);
  const isPrefilled = !!useLocation<{ prefill?: unknown }>().state?.prefill;

  //Note: prevIsArcpRef used to 'remember' the previous value (something the useEffect doesn't), so we can clear the programme linkage fields when use changes the isArcp  radio choice.
  // Note: this won't clear a linkage via a reloaded draft - resolveLinkedProgrammeFields does his later on if no matching id i.e. prog no longer valid since form save.
  const prevIsArcpRef = useRef(isArcp);

  useEffect(() => {
    const previousIsArcp = prevIsArcpRef.current;
    prevIsArcpRef.current = isArcp;
    if (typeof isArcp !== "boolean") return;
    if (hasStaleLinkage(lifecycleState, isArcp, programmeMembershipId)) return;

    const isArcpChanged =
      typeof previousIsArcp === "boolean" && previousIsArcp !== isArcp;

    const resolvedProgFields = resolveLinkedProgrammeFields(
      programmesArr,
      isArcp,
      isArcpChanged ? "" : programmeMembershipId
    );

    // note: the nullish coalesce stops pointless draft save (null to "").
    setFormData(prevFormData => {
      const hasChanged = Object.entries(resolvedProgFields).some(
        ([key, value]) => (prevFormData[key] ?? "") !== value
      );
      return hasChanged
        ? { ...prevFormData, ...resolvedProgFields }
        : prevFormData;
    });
  }, [
    isArcp,
    programmeMembershipId,
    lifecycleState,
    programmesArr,
    setFormData
  ]);

  let linkagePageNotice;
  if (!programmesArr?.length) {
    linkagePageNotice = {
      [PROG_LINK_PAGE_NAME]: (
        <InsetText data-cy="noProgrammesNote">
          {formRNoProgrammesNotice}
        </InsetText>
      )
    };
  } else if (
    typeof isArcp === "boolean" &&
    linkedProgrammeOptions.length === 0
  ) {
    linkagePageNotice = {
      [PROG_LINK_PAGE_NAME]: (
        <InsetText data-cy="noLinkageOptionsNote">
          {formRNoLinkageOptionsNotice}
        </InsetText>
      )
    };
  } else if (isPrefilled) {
    linkagePageNotice = {
      [PROG_LINK_PAGE_NAME]: (
        <InsetText data-cy="prefillNote">{formRPrefillNotice}</InsetText>
      )
    };
  }

  return (
    <FormBuilder
      options={{ ...options, arcpOptions, linkedProgrammeOptions }}
      validationSchema={validationSchema}
      pageNotices={linkagePageNotice}
    />
  );
}
