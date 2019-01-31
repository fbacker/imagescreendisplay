const _ = require("lodash");

module.exports = data =>
  new Promise((resolve, reject) => {
    console.log(`read messages id ${data.message.id}`);
    data.client.users.messages.get(
      {
        userId: "me",
        id: data.message.id,
        format: "full"
      },
      (err, res) => {
        if (err) return reject(err);
        //console.log("read  response", res.data);
        data.body = res.data.snippet;
        //console.log("read  response", res.data.payload.parts);
        data.attachments = [];
        _.forEach(res.data.payload.parts, part => {
          console.log("part", part.mimeType);
          switch (part.mimeType) {
            case "image/png":
            case "image/jpg":
            case "image/jpeg":
              data.attachments.push({
                id: part.body.attachmentId,
                mimeType: part.mimeType,
                filename: part.filename
              });
              break;
            /*
            case "text/plain":
              if (part.partId === "0") {
                const basedata = part.body.data;
                let buff = new Buffer(basedata, "base64");
                let text = buff.toString("ascii");
                console.log("decode", basedata, text, part);
              }
              break;
              */
            default:
              //console.log("got part", part);
              break;
          }
        });
        /*
        if (data.attachments.length === 0) {
          return reject("No attachments");
        }
        */
        resolve(data);
      }
    );
  });
