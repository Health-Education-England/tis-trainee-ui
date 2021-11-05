import "./commands";
import "@cypress/code-coverage/support";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

Cypress.dayjs = dayjs;
Cypress.duration = duration;
