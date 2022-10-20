import { ProgrammeMembership } from "../models/ProgrammeMembership";
import {
  addNotification,
  resetNotifications
} from "../redux/slices/notificationsSlice";
import store from "../redux/store/store";

export function dispatchCojNotif() {
  // TODO check state for signedCoj (see below)
  const signedCoj = false;
  store.dispatch(resetNotifications());
  if (!signedCoj) {
    store.dispatch(
      addNotification({
        type: "Warning",
        text: "- You have no signed Conditions of Joining agreement",
        link: "/profile/programmes"
      })
    );
  }
}

//TODO move this logic into redux state
export function hasSignedCOJ(pms: ProgrammeMembership[]) {
  return pms.findIndex((pm, _index) => pm.hasSignedCoj) !== -1;
}
