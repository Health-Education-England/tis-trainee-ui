import { Header } from "@tanstack/react-table";
import { NotificationType } from "../../redux/slices/notificationsSlice";

type AllUnreadCheckboxProps = {
  header: Header<NotificationType, unknown>;
};

export function AllUnreadCheckbox({
  header
}: Readonly<AllUnreadCheckboxProps>) {
  return (
    <div>
      <label htmlFor="unreadCheck" className="nhsuk-u-font-size-14">
        Unread
      </label>
      <input
        type="checkbox"
        id="unreadCheck"
        value={(header.column.getFilterValue() as string) || "read"}
        defaultChecked={false}
        onChange={e =>
          header.column.setFilterValue(
            e.target.value === "read" ? "unread" : "read"
          )
        }
      ></input>
    </div>
  );
}
