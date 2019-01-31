const _ = require("lodash");

module.exports = data =>
  new Promise((resolve, reject) => {
    console.log(`mark as read ${data.message.id}`);
    data.client.users.messages.modify(
      {
        userId: "me",
        id: data.message.id,
        resource: {
          removeLabelIds: ["UNREAD"]
        }
      },
      (err, res) => {
        if (err) return reject(err);
        resolve(data);
      }
    );
  });
