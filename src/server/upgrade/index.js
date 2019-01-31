module.exports = function() {
  return new Promise((resolve, reject) => {
    console.log("Run upgrade");
    const dbUpgrade = require("./db");
    const dbrun = dbUpgrade().then(success => {
      console.log("database upgrade success", success);
      if (success) resolve();
      else reject();
    });
  });
};
