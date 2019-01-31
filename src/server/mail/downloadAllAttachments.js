const _ = require("lodash");
const downloadSingleAttachment = require("./downloadSingleAttachment");

module.exports = data =>
  new Promise((resolve, reject) => {
    console.log(`download all`);
    let list = [];
    _.each(data.attachments, item => {
      //console.log("download", item);
      list.push(
        downloadSingleAttachment({
          client: data.client,
          messageId: data.message.id,
          item
        })
      );
    });
    Promise.all(list)
      .then(files => {
        console.log("all files done");
        data.files = _.compact(files);
        resolve(data);
      })
      .catch(e => {
        console.log("error", e);
        reject("stop");
      });
  });
