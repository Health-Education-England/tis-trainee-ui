import { SummaryList } from "nhsuk-react-components";
import { LinkedFormRDataType } from "./FormLinkerForm";
import dayjs from "dayjs";
import { useAppSelector } from "../../../redux/hooks/hooks";

export function FormLinkerSummary({
  isArcp,
  linkedProgrammeUuid,
  managingDeanery
}: Readonly<LinkedFormRDataType>) {
  const linkedProgramme = useAppSelector(state =>
    state.traineeProfile.traineeProfileData.programmeMemberships.find(
      programme => programme.programmeTisId === linkedProgrammeUuid
    )
  );

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
        ? `${linkedProgramme.programmeName} (start: ${dayjs(
            linkedProgramme.startDate
          ).format("DD/MM/YYYY")} )`
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
            <SummaryList.Value>{value}</SummaryList.Value>
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
      Note: Setting the ARCP status and linked Programme is a new feature.
      Currently, it is not possible to set these values on a form submitted
      before this new feature went live. If, however, you think this ability
      would be useful, then please complete the survey which should appear on
      this page.
    </p>
  );
}
