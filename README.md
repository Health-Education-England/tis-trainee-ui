![Analyse with SonarQube](https://github.com/Health-Education-England/trainee-ui/workflows/Analyse%20with%20SonarQube/badge.svg)  
![Main Branch Status: CI/CD Workflow](https://github.com/Health-Education-England/trainee-ui/workflows/CI/CD%20Workflow/badge.svg?branch=main)  
![Deployment Status: CI/CD Workflow](https://github.com/Health-Education-England/trainee-ui/workflows/CI/CD%20Workflow/badge.svg?branch=main&event=deployment_status)

# trainee-ui

Front-end for TIS Self-Service app

## Tech Stack and Architecture

Full Tech and Architecture are described elsewhere. The front-end uses REST interaction with the back-end service(s).

[Next.js](https://nextjs.org/) is used to build the app. It is now the industry standard for building an enterprise-level React applications. It gives lots of out-the-box features such as code-splitting and build optimization and allows full control over the underlying configuration. It will also allow for SSR as and when we decide (which can be on a component-by-component basis) which will improve UX.
We are currently in the process of migrating fully to Next.js so the app is still a SPA.
The app is written in [TypeScript](https://www.typescriptlang.org/) using the [React](https://reactjs.org/) library.

## Core Libraries

1. [React Router](https://reactrouter.com/) for Routing
2. [Redux Toolkit](https://redux-toolkit.js.org/) for State Management
3. [Redux-Thunk](https://github.com/reduxjs/redux-thunk) middleware (for e.g. handling asynchronous redux actions)
4. [Axios](https://github.com/axios/axios) for HTTP communication
5. [nhsuk react components](https://github.com/NHSDigital/nhsuk-react-components/releases/tag/v1.2.0) for UI design
6. [Jest](https://jestjs.io/) for unit and snapshot testing
7. [Cypress](https://www.cypress.io/) for E2E testing amd Component Testing (CT)

### Initial decision-making/conversation

The thread can be picked up from the Jira ticket [Identify Core React Libraries](https://hee-tis.atlassian.net/browse/TISNEW-3581)

## Running the application locally

`npm run dev` runs the app in the development mode.<br />
Open [http://local.tis-selfservice.com](http://local.tis-selfservice.com/) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

Note: To populate the form with data, you will need to run the Docker containers to start the back-end services. See
[dev-handbook](https://github.com/Health-Education-England/dev-handbook/tree/main/tis-self-service) for more details on these services.

## Testing with BrowserStack

Sign in [BrowserStack](https://www.browserstack.com/users/sign_in) with your work email. Start a web testing session by clicking `Live` on the menu bar. You can enter the URL of TSS Preprod/Prod for testing.<br />
Clicking `Switch browser` on the left side menu, you may choose different browsers / OS / mobile devices to test with.

### Running local test on BrowserStack

In a Live session, enable `Local testing` from the left side menu. Follow the instructions to download the BrowserStack Local app if it is the first time config. Enable `Resolve all URLs through my network` in the setting. Enter your localhost URL in the remote browser's address bar for live local test.<br />
For more information visit (https://www.browserstack.com/docs/live/local-testing#enable-local-testing)

## Automated tests

### Unit Tests (Jest)

Unit tests are found in the `__test__` folders throughout the app and end with `.test.ts` .

`npm test` launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### Component Tests (React-Testing-Library)

RTL component tests are also in the `__test__` folders and end with `.test.tsx`

### Component Tests (Cypress)

Cypress CT are found in the `cypress/component` folder and end with `cy.tsx` .

`npm run ct:headless` will run CT in headless mode.<br />
`npm run ct` will allow you to view the CT in the browser. For more information visit (https://docs.cypress.io/guides/component-testing/overview)

### E2e tests (Cypress)

Cypress e2e tests are found in the `cypress/e2e` folder and end with `spec.ts` .

#### configurating e2e tests

Before you can run the e2e tests (logging in as an authorised user using a One Time Pass Code), you will need to add a `cypress.env.json` file to the root of your project folder:

```
{
  "username": "end.tester@hee.nhs.uk",
  "password": "xxxxxxxx",
  "secret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

#### running e2e tests

`npm run cypress:headless` will run the e2e tests in headless mode with Cypress.<br />
`npm run cypress` will allow you to view the e2e tests in the browser. For more information visit (https://docs.cypress.io/guides/end-to-end-testing/writing-your-first-end-to-end-test)

## Building a production app

`npm run build` generates an optimized version of your application for production. This standard output includes:

- HTML files for pages using getStaticProps or Automatic Static Optimization
- CSS files for global styles or for individually scoped styles
- JavaScript for pre-rendering dynamic content from the Next.js server
- JavaScript for interactivity on the client-side through React

This output is generated inside the `.next` folder.

See the section about [deployment](https://nextjs.org/docs/deployment) for more information.

#### Preprod Deployment

When deploying to preprod the `ENV` environment variable should be set to
`preprod`, allowing the correct dotenv file to be loaded.

### Deployment pipeline

Note that e2e tests are not run as part of the suite of automated PR tests. They are only run after a PR is merged and built: they are run against the resulting preprod instance.

This means that you need to run the e2e tests locally (which you should be doing anyway) and not rely on the PR / Sonarcloud automated checks to avoid deploying failing code to preprod.
