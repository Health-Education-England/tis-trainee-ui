import { SummaryList } from "nhsuk-react-components";
import dayjs from "dayjs";
import { getStatusReasonLabel } from "../../../utilities/ltftUtilities";
import { StringUtilities } from "../../../utilities/StringUtilities";
import { LtftObjNew } from "../../../models/LtftTypes";

export const LtftStatusDetails = (formData: LtftObjNew) => {
  const currentState = formData.status?.current?.state;
  return (
    <>
      <h3 data-cy={`${currentState}-header`}>
        {StringUtilities.capitalize(currentState)} application
      </h3>
      <SummaryList>
        <SummaryList.Row>
          <SummaryList.Key>Name</SummaryList.Key>
          <SummaryList.Value data-cy="ltftName">
            {formData.name}
          </SummaryList.Value>
        </SummaryList.Row>
        <SummaryList.Row>
          <SummaryList.Key>Created date</SummaryList.Key>
          <SummaryList.Value data-cy="ltftCreated">
            {dayjs(formData.created).toString()}
          </SummaryList.Value>
        </SummaryList.Row>
        <SummaryList.Row>
          <SummaryList.Key>
            {StringUtilities.capitalize(currentState)} date
          </SummaryList.Key>
          <SummaryList.Value data-cy="ltftModified">
            {dayjs(formData.lastModified).toString()}
          </SummaryList.Value>
        </SummaryList.Row>
        {(currentState === "UNSUBMITTED" ||
          currentState === "WITHDRAWN" ||
          currentState === "REJECTED") && (
          <>
            <SummaryList.Row>
              <SummaryList.Key>
                {StringUtilities.capitalize(currentState)} by
              </SummaryList.Key>
              <SummaryList.Value data-cy="ltftModifiedBy">
                {formData.status.current.modifiedBy.role === "TRAINEE"
                  ? "Me"
                  : "TIS Admin"}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Reason</SummaryList.Key>
              <SummaryList.Value data-cy="ltfReason">
                {getStatusReasonLabel(
                  currentState,
                  formData.status.current.detail.reason
                )}
              </SummaryList.Value>
            </SummaryList.Row>
            {formData.status.current.detail.message && (
              <SummaryList.Row>
                <SummaryList.Key>Message</SummaryList.Key>
                <SummaryList.Value data-cy="ltftMessage">
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
  );
};
