const upgrade = require("./upgrade/index");
const app = require("./app");

upgrade().then(() => {
  console.log("upgrade is done");
  app();
});
