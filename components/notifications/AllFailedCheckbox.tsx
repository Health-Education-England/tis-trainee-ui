import { applyNotificationStatusFilter } from "../../utilities/NotificationsUtilities";
import { useAppSelector } from "../../redux/hooks/hooks";

export function AllFailedCheckbox() {
  const notificationsStatusFilter = useAppSelector(
    state => state.notifications.notificationsStatusFilter
  );
  return (
    <div>
      <label htmlFor="failedCheck" className="nhsuk-u-font-size-14">
        Failed
      </label>
      <input
        type="checkbox"
        id="failedCheck"
        value={notificationsStatusFilter || ""}
        defaultChecked={false}
        checked={notificationsStatusFilter === "FAILED"}
        onChange={() =>
          applyNotificationStatusFilter(
            notificationsStatusFilter === "" ? "FAILED" : ""
          )
        }
      ></input>
    </div>
  );
}
