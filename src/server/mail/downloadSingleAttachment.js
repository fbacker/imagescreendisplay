const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
const md5 = require("md5");
const sharp = require("sharp");

module.exports = data =>
  new Promise((resolve, reject) => {
    console.log(`read attachment id ${data.messageId} ${data.item.id}`);
    data.client.users.messages.attachments.get(
      {
        userId: "me",
        messageId: data.messageId,
        id: data.item.id
      },
      (err, res) => {
        if (err) return reject(err);
        // find extension for file
        let ext = mime.extension(data.item.mimeType);
        if (!ext) {
          ext = data.item.filename.substring(
            data.item.filename.lastIndexOf(".") + 1
          );
        }

        const name = md5(data.messageId + data.item.filename);
        const filename = `${name}.${ext}`;
        const filePath = path.join("public", "files", filename);
        fs.exists(filePath, exists => {
          if (exists) {
            console.log(`file exists ${filePath}`);
            return resolve(null);
          }
          console.log("we got a file", name, ext, data.item);
          const buff = Buffer.from(res.data.data, "base64");

          sharp(buff)
            .rotate()
            .toBuffer(function(err, outputBuffer, info) {
              // auto-rotated using EXIF Orientation tag
              // info.width and info.height contain the dimensions of the resized image
              console.log("image", info);
              fs.writeFile(filePath, outputBuffer, err => {
                if (err) return reject(err);
                console.log("File saved");
                resolve({ id: name, filename });
              });
            });
        });
      }
    );
  });
