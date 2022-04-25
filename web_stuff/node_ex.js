/**
 * Very simple site for serving static pages
 * and performing one simple query on the rocket database
 *
 * To start: UNIX> nohup node app6.js &
 *           where apps6.js is the name of this file
 *           nohup allows things to run in background, smoothly
 */

const path = require("path");
const express = require("express");
const { Pool } = require("pg"); // connecting to postgres
const {
  CommandCompleteMessage,
  closeComplete,
} = require("pg-protocol/dist/messages");

// Connection to postgres parameters
const pool = new Pool({
  user: "dbuser",
  host: "localhost",
  database: "isanford",
  password: "12345678",
  port: 5432,
});

console.log("Created pool ", pool);

const app = express();
const port = 40969;

// static pages are served from the same directory as this file
app.use("/", express.static(path.join(__dirname)));

function init_dbreq(dberr, client, done, req, res) {
  if (dberr) {
    res.writeHead(500);
    res.end(
      "Sorry, check with the site admin for error: " + dberr.code + " ..\n"
    );
    return;
  }

  //   let postt = req.body;

  client.query("SELECT * from game", function (dberr, dbres) {
    done();
    if (dberr) {
      res.writeHead(500);
      res.end(
        "Sorry, check with the site admin for error: " + dberr.code + " ..\n"
      );
    } else {
      res.json(dbres.rows);
    }
  });
}

// do a query to Postgres and return the result as JSON
function dbreq1(dberr, client, done, req, res) {
  if (dberr) {
    res.writeHead(500);
    res.end(
      "Sorry, check with the site admin for error: " + dberr.code + " ..\n"
    );
    return;
  }
  let postt = req.body;
  client.query(
    "SELECT * from game order by random() limit " + postt["count"],
    function (dberr, dbres) {
      done();
      if (dberr) {
        res.writeHead(500);
        res.end(
          "Sorry, check with the site admin for error: " + dberr.code + " ..\n"
        );
      } else {
        res.json(dbres.rows);
      }
    }
  );
}

// tell express aboout how to handle the dq1 request
app.post("/games", express.json({ type: "*/*" }), function (req, res) {
  pool.connect(function (dberr, client, done) {
    init_dbreq(dberr, client, done, req, res);
  });
});

// tell express aboout how to handle the dq1 request
app.post("/dq1", express.json({ type: "*/*" }), function (req, res) {
  pool.connect(function (dberr, client, done) {
    dbreq1(dberr, client, done, req, res);
  });
});

// start the Node server
app.listen(port, function (error) {
  if (error) throw error;
  console.log(`Server created Successfully on port ${port}`);
});
