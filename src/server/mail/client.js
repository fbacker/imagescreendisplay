const fs = require("fs");
const _ = require("lodash");
const readline = require("readline");
const { google } = require("googleapis");
const EventEmitter = require("events");

const getOneMessage = require("./getOneMessage");
const readMessage = require("./readMessage");
const markAsRead = require("./markAsRead");
const packageData = require("./packageData");
const downloadAllAttachments = require("./downloadAllAttachments");

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.modify"
];
const TOKEN_PATH = "token.json";

class EmailClient extends EventEmitter {
  connect() {
    // Load client secrets from a local file.
    fs.readFile("credentials.json", (err, content) => {
      if (err) return console.error("Error loading client secret file:", err);
      // Authorize a client with credentials, then call the Gmail API.
      this._authorize(JSON.parse(content));
    });
  }

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   */
  _authorize(credentials) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return this._getNewToken(oAuth2Client);
      oAuth2Client.setCredentials(JSON.parse(token));
      this._connected(oAuth2Client);
    });
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   */
  _getNewToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES
    });
    console.log("Authorize this app by visiting this url:", authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question("Enter the code from that page here: ", code => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error("Error retrieving access token", err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
          if (err) return console.error(err);
          console.log("Token stored to", TOKEN_PATH);
        });
        this._connected(oAuth2Client);
      });
    });
  }

  _readLabels() {
    this.client.users.labels.list(
      {
        userId: "me"
      },
      (err, res) => {
        if (err) throw Exeption(err);
        console.log("data", res.data);
        //resolve(data);
      }
    );
  }

  _connected(auth) {
    // set auth as a global default
    /*
    google.options({
      auth
    });
    */
    this.client = google.gmail({ version: "v1", auth });
    //console.log("clietm", this.client.users.messages.list);
    //this._readLabels();
    console.log("connected");
    this.emit("connected");
  }

  getNewMessageMedia() {
    return new Promise((resolve, reject) => {
      getOneMessage({ client: this.client })
        .then(readMessage)
        .then(downloadAllAttachments)
        .then(markAsRead)
        .then(packageData)
        .then(data => {
          console.log("happy");
          resolve(data);
        })
        .catch(e => {
          console.error("not happy", e);
          reject(e);
        });
    });
  }
}

module.exports = EmailClient;
