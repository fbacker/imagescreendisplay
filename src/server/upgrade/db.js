const databaseVersion = 1;

const AppDB = require("../db/connection");
const AppDBMedia = require("../db/assets");
const AppDBUsers = require("../db/user");
const AppDBSettings = require("../db/settings");
const dbConnection = new AppDB("./database.sqlite3");
const tableSettings = new AppDBSettings(dbConnection);
const tableMedia = new AppDBMedia(dbConnection);
const tableUsers = new AppDBUsers(dbConnection);

const upgrade = version => {
  switch (version) {
    case 2:
      console.log("do version 2 things");
      break;
    case 3:
      console.log("do version 3 things");
      break;
  }
};

const upgradeDatabase = version => {
  return new Promise((resolve, reject) => {
    if (version <= databaseVersion) {
      // do stuff
      upgrade(version);
      version++;
      return upgradeDatabase(version);
    } else {
      version--;
      const vSave = "" + version;
      tableSettings.update("version", vSave).then(db => {
        resolve();
      });
    }
  });
};

module.exports = function() {
  return new Promise((resolve, reject) => {
    tableMedia
      .createTable()
      .then(tableMedia.createTableConnections())
      .then(tableUsers.createTable())
      .then(tableUsers.createTableConnections())
      .then(tableSettings.createTable())
      .then(() => {
        console.log("db created");
        tableSettings.get("version").then(versionObject => {
          let version = parseInt(versionObject.value, 10);
          upgradeDatabase(++version).then(() => {
            resolve(true);
          });
        });
      });
  });
};
