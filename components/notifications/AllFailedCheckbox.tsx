import { Header } from "@tanstack/react-table";
import { NotificationType } from "../../redux/slices/notificationsSlice";

type AllFailedCheckboxProps = {
  header: Header<NotificationType, unknown>;
};

export function AllFailedCheckbox({
  header
}: Readonly<AllFailedCheckboxProps>) {
  return (
    <div>
      <label htmlFor="failedCheck" className="nhsuk-u-font-size-14">
        Failed
      </label>
      <input
        type="checkbox"
        id="failedCheck"
        value={(header.column.getFilterValue() as string) || "sent"}
        defaultChecked={false}
        onChange={e =>
          header.column.setFilterValue(
            e.target.value === "sent" ? "failed" : ""
          )
        }
      ></input>
    </div>
  );
}
