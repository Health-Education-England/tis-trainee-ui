![Analyse with SonarQube](https://github.com/Health-Education-England/trainee-ui/workflows/Analyse%20with%20SonarQube/badge.svg)  
![Main Branch Status: CI/CD Workflow](https://github.com/Health-Education-England/trainee-ui/workflows/CI/CD%20Workflow/badge.svg?branch=main)  
![Deployment Status: CI/CD Workflow](https://github.com/Health-Education-England/trainee-ui/workflows/CI/CD%20Workflow/badge.svg?branch=main&event=deployment_status)

# trainee-ui

Front-end for TIS Self-Service app

## Tech Stack and Architecture

Full Tech and Architecture are described elsewhere. The front-end uses REST interaction with the back-end service(s).

[Create React App (CRA)](https://create-react-app.dev/) is used to build the app as it comes with many build tools already configured.
This single page application (SPA) is written in [TypeScript](https://www.typescriptlang.org/) using the [React](https://reactjs.org/) library.

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

`npm start` runs the app in the development mode.<br />
Open [http://local.tis.com](http://local.tis.com/) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

Note: To populate the form with data, you will need to run the Docker containers to start the back-end services. See
[dev-handbook](https://github.com/Health-Education-England/dev-handbook/tree/main/tis-self-service) for more details on these services.

## Unit tests (Jest)

`npm test` launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## E2E tests (cypress)

### configurating e2e tests

Before you can run the e2e tests (logging in as an authorised user using a One Time Pass Code), you will need to add a `cypress.env.json` file to the root of your project folder:

```
{
  "username": "end.tester@hee.nhs.uk",
  "password": "xxxxxxxx",
  "secret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

### running e2e tests

`npm run cypress` will run the e2e tests in headless mode with Cypress.<br />
`npm run cypress:open` will allow you to view the tests in the browser. For more information visit (https://www.cypress.io/)

## Building a production app

`npm run build` builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
The app is then ready to be deployed.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### Preprod Deployment

When deploying to preprod the `ENV` environment variable should be set to
`preprod`, allowing the correct dotenv file to be loaded.

## Ejecting from CRA (Create React App)

`npm run eject` will 'eject' the app from CRA at any time in the development process if, for example, more choices are needed for build tools and configuration. This command will remove the single build dependency from your project.

**Note**

You can `eject` at any time in the development cycle

This is a one-way operation. Once you `eject`, you can’t go back!

It will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
