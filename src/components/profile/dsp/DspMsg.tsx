import { SummaryList } from "nhsuk-react-components";
import { DateUtilities } from "../../../utilities/DateUtilities";

interface IDspMsg {
  panelName: string;
}

const DspMsg: React.FC<IDspMsg> = ({ panelName }) => {
  // TODO need an issued date
  const msgDate = null;
  return (
    <>
      <SummaryList.Row>
        <SummaryList.Key data-cy="dspIssueDateKey">
          Date added to your Digital Staff Passport
        </SummaryList.Key>
        <SummaryList.Value>
          {msgDate ? (
            <span>
              You last added this {panelName} to your wallet on{" "}
              {DateUtilities.ToLocalDateTime(msgDate)}.
            </span>
          ) : (
            <span data-cy="noIssueDateMsg">
              You have yet to add this {panelName} to your wallet.{" "}
            </span>
          )}
        </SummaryList.Value>
      </SummaryList.Row>
    </>
  );
};

export default DspMsg;
