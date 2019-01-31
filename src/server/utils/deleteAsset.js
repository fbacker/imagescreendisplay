const fs = require("fs");
const path = require("path");

module.exports = filename =>
  new Promise((resolve, reject) => {
    console.log(`delete file ${filename}`);
    const filePath = path.join("public", "files", filename);
    fs.exists(filePath, exists => {
      if (!exists) {
        return reject("File doesnt exists");
      }
      fs.unlink(filePath, err => {
        if (err) return reject(err);
        console.log("File delete");
        resolve();
      });
    });
  });
