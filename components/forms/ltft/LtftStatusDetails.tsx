import { SummaryList } from "nhsuk-react-components";
import { LtftObj } from "../../../redux/slices/ltftSlice";
import dayjs from "dayjs";
import { getStatusReasonLabel } from "../../../utilities/ltftUtilities";
import { StringUtilities } from "../../../utilities/StringUtilities";

export const LtftStatusDetails = (formData: LtftObj) => {
  return (
    <>
      {formData.status?.current?.state != "DRAFT" && (
        <>
          <h3>
            {StringUtilities.capitalize(formData.status?.current?.state)}{" "}
            application
          </h3>
          <SummaryList>
            <SummaryList.Row>
              <SummaryList.Key>Name</SummaryList.Key>
              <SummaryList.Value data-cy="ltftName">
                {formData.name}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Created</SummaryList.Key>
              <SummaryList.Value data-cy="ltftCreated">
                {dayjs(formData.created).toString()}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>
                {StringUtilities.capitalize(formData.status?.current?.state)}
              </SummaryList.Key>
              <SummaryList.Value data-cy="ltftSubmitted">
                {dayjs(formData.lastModified).toString()}
              </SummaryList.Value>
            </SummaryList.Row>
            {(formData.status?.current?.state === "UNSUBMITTED" ||
              formData.status?.current?.state === "WITHDRAWN") && (
              <>
                <SummaryList.Row>
                  <SummaryList.Key>
                    {StringUtilities.capitalize(
                      formData.status?.current?.state
                    )}{" "}
                    by
                  </SummaryList.Key>
                  <SummaryList.Value data-cy="ltftRef">
                    {formData.status.current.modifiedBy.role && (
                      <>
                        {StringUtilities.capitalize(
                          formData.status.current.modifiedBy.role
                        )}
                        :{" "}
                      </>
                    )}
                    {formData.status.current.modifiedBy.name && (
                      <>{formData.status.current.modifiedBy.name}</>
                    )}
                    {formData.status.current.modifiedBy.email && (
                      <> ({formData.status.current.modifiedBy.email})</>
                    )}
                  </SummaryList.Value>
                </SummaryList.Row>
                <SummaryList.Row>
                  <SummaryList.Key>Reason</SummaryList.Key>
                  <SummaryList.Value data-cy="ltftRef">
                    {getStatusReasonLabel(
                      formData.status?.current?.state,
                      formData.status.current.detail.reason
                    )}
                  </SummaryList.Value>
                </SummaryList.Row>
                {formData.status.current.detail.message && (
                  <SummaryList.Row>
                    <SummaryList.Key>Message</SummaryList.Key>
                    <SummaryList.Value data-cy="ltftRef">
                      {formData.status.current.detail.message}
                    </SummaryList.Value>
                  </SummaryList.Row>
                )}
              </>
            )}
            <SummaryList.Row>
              <SummaryList.Key>Reference</SummaryList.Key>
              <SummaryList.Value data-cy="ltftRef">
                {formData.formRef}
              </SummaryList.Value>
            </SummaryList.Row>
          </SummaryList>
        </>
      )}
    </>
  );
};
