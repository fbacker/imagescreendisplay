const _ = require("lodash");

module.exports = data =>
  new Promise((resolve, reject) => {
    delete data.client;
    const obj = {
      files: data.files,
      names: _.compact(data.body.split(" "))
    };
    console.log("package", obj);
    //console.log(`package`, data);
    resolve(obj);
  });
