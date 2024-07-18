import { SummaryList } from "nhsuk-react-components";
import { LinkedFormRDataType } from "./FormLinkerForm";
import dayjs from "dayjs";
import { useAppSelector } from "../../../redux/hooks/hooks";

export function FormLinkerSummary({
  isArcp,
  linkedProgrammeUuid,
  managingDeanery
}: LinkedFormRDataType) {
  const linkedProgramme = useAppSelector(state =>
    state.traineeProfile.traineeProfileData.programmeMemberships.find(
      programme => programme.programmeTisId === linkedProgrammeUuid
    )
  );

  const rows = [
    { key: "ARCP Form:", value: isArcp ? "Yes" : "No" },
    {
      key: "Linked Programme:",
      value: linkedProgramme?.programmeName
        ? `${linkedProgramme.programmeName} (start: ${dayjs(
            linkedProgramme.startDate
          ).format("DD/MM/YYYY")} )`
        : "No linked programme. Please contact support."
    },
    { key: "Managing Deanery:", value: managingDeanery }
  ];

  return (
    <SummaryList>
      {rows.map(({ key, value }) => (
        <SummaryList.Row>
          <SummaryList.Key>{key}</SummaryList.Key>
          <SummaryList.Value>{value}</SummaryList.Value>
        </SummaryList.Row>
      ))}
    </SummaryList>
  );
}
