import { configure } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { Amplify } from "aws-amplify";
import config from "./aws-amplify/config";

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  }
});

configure({ adapter: new Adapter() });

if (typeof window.URL.createObjectURL === "undefined") {
  window.URL.createObjectURL = jest.fn();
}

// Needed due to this open issue with jsdom (Jest dependency): https://github.com/jsdom/jsdom/issues/1721
// https://ui.docs.amplify.aws/react/getting-started/troubleshooting

module.exports = {
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"]
};
