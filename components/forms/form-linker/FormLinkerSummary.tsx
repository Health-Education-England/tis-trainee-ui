import { SummaryList } from "nhsuk-react-components";
import { LinkedFormRDataType } from "./FormLinkerForm";
import dayjs from "dayjs";
import { useAppSelector } from "../../../redux/hooks/hooks";

export function FormLinkerSummary({
  isArcp,
  programmeMembershipId,
  managingDeanery
}: Readonly<LinkedFormRDataType>) {
  const programmeMemberships = useAppSelector(
    state => state.traineeProfile.traineeProfileData.programmeMemberships
  );
  const linkedProgramme = programmeMemberships.find(
    prog => prog.tisId === programmeMembershipId
  );
  const linkedProgrammeName = linkedProgramme?.programmeName;
  const linkedProgrammeStartDate = linkedProgramme?.startDate;

  const calcIsArcpValue = (v: boolean | null) => {
    if (typeof v !== "boolean") {
      return "ARCP status not set";
    }
    return v ? "Yes" : "No";
  };

  const rows = [
    { key: "ARCP Form?", value: calcIsArcpValue(isArcp) },
    {
      key: "Linked Programme:",
      value: linkedProgramme
        ? `${linkedProgrammeName} (start: ${dayjs(
            linkedProgrammeStartDate
          ).format("DD/MM/YYYY")})`
        : "Linked programme not set."
    },
    {
      key: "Managing Deanery / Local Office:",
      value: managingDeanery ?? "Not set"
    }
  ];

  return (
    <>
      <SummaryList className="form-linker_summary">
        {rows.map(({ key, value }) => (
          <SummaryList.Row key={key}>
            <SummaryList.Key>{key}</SummaryList.Key>
            <SummaryList.Value data-cy={`${key}-value`}>
              {value}
            </SummaryList.Value>
          </SummaryList.Row>
        ))}
      </SummaryList>
      {typeof isArcp !== "boolean" && <OldFormSummaryText />}
    </>
  );
}

function OldFormSummaryText() {
  return (
    <p>
      {`Note: Setting the ARCP status and linked Programme is a new feature.
      Currently, to set these values on a form submitted before this new feature
      went live, you will need to contact Support (Local Office) to get the form
      'unsubmitted' so you can link and then resubmit it.`}
    </p>
  );
}
