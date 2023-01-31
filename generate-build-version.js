const fs = require("fs");
const packageJson = require("./package.json");
const appVersion = packageJson.version;

const jsonData = {
  version: appVersion
};

var jsonContent = JSON.stringify(jsonData);

fs.writeFile("./public/meta.json", jsonContent, "utf8", err =>
  err
    ? console.log(`Something went wrong writing meta.json file: ${err}`)
    : console.log(
        `meta.json file with latest version (${appVersion}) successfully written`
      )
);
