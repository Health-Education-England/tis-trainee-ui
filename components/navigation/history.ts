import { createBrowserHistory } from "history";

let history: any;
if (typeof document !== "undefined") {
  history = createBrowserHistory();
}

export default history;
