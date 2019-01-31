module.exports = data =>
  new Promise((resolve, reject) => {
    data.client.users.messages.list(
      {
        userId: "me",
        includeSpamTrash: false,
        q: "is:unread has:attachment",
        maxResults: 1
      },
      (err, res) => {
        if (err) return reject(err);
        console.log("read messages response", res.data.messages);
        if (!res.data.messages || res.data.messages.length === 0) {
          return reject("no messages");
        }
        data.message = res.data.messages[0];
        resolve(data);
      }
    );
  });
