const express = require("express");
const cors = require("cors");
const os = require("os");
const _ = require("lodash");
const moment = require("moment");
const bodyParser = require("body-parser");
// database
const AppDB = require("./db/connection");
const AppDBMedia = require("./db/assets");
const AppDBUsers = require("./db/user");
// mail
const Mail = require("./mail/client");
//other
const deleteAsset = require("./utils/deleteAsset");

// config
const port = process.env.PORT || 8080; // set our port

const dbConnection = new AppDB("./database.sqlite3");
const tableMedia = new AppDBMedia(dbConnection);
const tableUsers = new AppDBUsers(dbConnection);
const mail = new Mail();

const router = express.Router(); // get an instance of the express Router
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("dist"));

router.get("/", function(req, res) {
  res.json({ message: "hooray! welcome to our api!" });
});
router.get("/getUsername", (req, res) =>
  res.send({ username: os.userInfo().username })
);
router.get("/read", (req, res) => res.send("ok"));

router.get("/assets/history", (req, res) => {
  const days = req.query.days ? parseInt(req.query.days, 10) : 30;
  console.log("params", days);
  tableMedia
    .getHistory(days)
    .then(history => {
      //console.log("history", history);
      res.send(history);
    })
    .catch(e => console.error("history", e));
});

router.get("/assets", (req, res) => {
  let from = req.query.from
    ? moment.unix(parseInt(req.query.from, 10))
    : moment().subtract(3, "months");
  let to = req.query.to ? moment.unix(parseInt(req.query.to, 10)) : moment();
  from.hour(0).minute(1);
  to.hour(23).minute(59);
  from = from.unix();
  to = to.unix();

  let users = req.query.users ? req.query.users.split(",") : [];
  users = _.map(users, u => parseInt(u, 10));
  tableMedia
    .getAllFilter(from, to, users)
    .then(media => {
      media = _.uniqBy(media, "key");
      //console.log("media", media);
      res.send(media);
    })
    .catch(e => console.error("users list", e));
});

router.get("/assets/preview", (req, res) => {
  tableMedia
    .getAllPreview()
    .then(media => {
      //console.log("media", media);
      res.send(media);
    })
    .catch(e => console.error("users list", e));
});

router.get("/assets/connections", (req, res) => {
  tableMedia
    .getAllConnections()
    .then(list => {
      //console.log("media connections", list);
      res.send(list);
    })
    .catch(e => console.error("conn list", e));
});

router.delete("/assets/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  tableMedia
    .getById(id)
    .then(media => {
      console.log("media to delete", media);

      tableMedia
        .delete(id)
        .then(result => {
          console.log("removed asset from db", result);
          deleteAsset(media.filename)
            .then(() => {
              res.send(result);
            })
            .catch(e2 => console.error("failed delete file", e2));
        })
        .catch(e1 => console.error("removed from db", e1));
    })
    .catch(e => console.error("id not found", e));
});

router.get("/assets/:id/connections", (req, res) => {
  const id = parseInt(req.params.id, 10);
  tableMedia
    .getConnections(id)
    .then(list => {
      console.log("asset connections", list);
      res.send(list);
    })
    .catch(e => console.error("connections error", e));
});

router.post("/assets/:id/connection", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idKid = req.body.id;
  console.log("create connection", { id, idKid });
  tableMedia
    .createConnection(id, idKid)
    .then(connection => {
      console.log("created connection", connection);
      res.send(connection);
    })
    .catch(e => console.error("add connection", e));
});

router.delete("/assets/:id/connection", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idKic = req.body.id;
  console.log("delete connection", { id, idKic });
  tableMedia
    .deleteConnection(id, idKic)
    .then(connection => {
      console.log("removed connection", connection);
      res.send(connection);
    })
    .catch(e => console.error("removed connection", e));
});

router.post("/assets/:id/display", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const display = req.body.display;
  console.log("update display 1", { id, display });
  tableMedia
    .setDisplay(id, display)
    .then(u => {
      console.log("updated", u);
      res.send(u);
    })
    .catch(e => console.error("updated", e));
});

//@TODO send email
router.post("/assets/:id/send", (req, res) => {
  const id = parseInt(req.params.id, 10);
  console.log("send to parents", { id });
  tableMedia
    .updateSent(id)
    .then(u => {
      console.log("updated", u);
      res.send(u);
    })
    .catch(e => console.error("updated", e));
});

router.get("/users", (req, res) => {
  tableUsers
    .getAll()
    .then(users => {
      //console.log("users", users);
      res.send(users);
    })
    .catch(e => console.error("users list", e));
});

router.post("/users", (req, res) => {
  const b = req.body;
  tableUsers
    .createUser(b.name, b.isParent, b.email)
    .then(user => {
      console.log("created", user);
      res.send(user);
    })
    .catch(e => console.error("users list", e));
});

router.post("/users/:id", (req, res) => {
  const idUser = parseInt(req.params.id, 10);
  const b = req.body;
  console.log("update user", b);
  tableUsers
    .updateUser(idUser, b.name, b.email)
    .then(user => {
      console.log("updated", user);
      res.send(user);
    })
    .catch(e => console.error("users list", e));
});

router.get("/users/connections", (req, res) => {
  tableUsers
    .getAllConnections()
    .then(list => {
      console.log("connections", list);
      res.send(list);
    })
    .catch(e => console.error("connection list", e));
});

router.delete("/users/:id", (req, res) => {
  const idUser = parseInt(req.params.id, 10);
  tableMedia.deleteConnectionUser(idUser);
  tableUsers
    .deleteUser(idUser)
    .then(result => {
      console.log("removed user", result);
      res.send(result);
    })
    .catch(e => console.error("removed user", e));
});

router.get("/users/:id/connections", (req, res) => {
  const idKid = parseInt(req.params.id, 10);
  tableUsers
    .getConnections(idKid)
    .then(connections => {
      console.log("kid connections", connections);
      res.send(connections);
    })
    .catch(e => console.error("connections error", e));
});

router.post("/users/:id/connection", (req, res) => {
  const idKid = parseInt(req.params.id, 10);
  const idParent = req.body.id;
  console.log("create connection", { idKid, idParent });
  tableUsers
    .createConnection(idParent, idKid)
    .then(connection => {
      console.log("created connection", connection);
      res.send(connection);
    })
    .catch(e => console.error("add user connection", e));
});

router.delete("/users/:id/connection", (req, res) => {
  const idKid = parseInt(req.params.id, 10);
  const idParent = req.body.id;
  console.log("delete connection", { idKid, idParent });
  tableUsers
    .deleteConnection(idParent, idKid)
    .then(connection => {
      console.log("removed connection", connection);
      res.send(connection);
    })
    .catch(e => console.error("removed user connection", e));
});

app.use("/api", router);

let mailCheckInterval = null;

const mailCheckForMessageCancel = () => {
  clearInterval(mailCheckInterval);
};
const mailCheckForMessage = () => {
  mail
    .getNewMessageMedia()
    .then(result => {
      const updateDb = (result1, userIds1) => {
        _.each(result1.files, file => {
          /*
          { 
            id: '88d2befd67d24dd5c1ac93f3320c39fa',
            filename: '88d2befd67d24dd5c1ac93f3320c39fa.jpeg' 
          } 
         */
          tableMedia
            .create(file.id, file.filename, moment().unix())
            .then(item => {
              console.log("added media", item.id, userIds1);
              _.each(userIds1, kidId =>
                tableMedia.createConnection(item.id, kidId)
              );
            });
        });
      };

      console.log("mailCheckForMessage", result);
      const names = result.names
        ? _.map(result.names, name => name.toLowerCase())
        : [];
      let userSearchActions = [];
      _.each(names, name => {
        userSearchActions.push(tableUsers.findUsersOnName(name));
      });
      Promise.all(userSearchActions).then(results => {
        let userIds = [];
        results = _.compact(results);
        console.log("child search result", { results, names });
        _.each(results, child => {
          if (child.id) userIds.push(child.id);
        });
        userIds = _.uniq(userIds);
        updateDb(result, userIds);
      });
    })
    .catch(e => {
      console.error("failed", e);
    });
};
mail.on("connected", () => {
  console.log("mail is connected");
  setInterval(mailCheckForMessage, 30000);
  mailCheckForMessage();
});

//@TODO check local files, compare to db, if missing delete file

module.exports = function() {
  app.listen(port, () => console.log(`Listening on port ${port}!`));
  mail.connect();
};
