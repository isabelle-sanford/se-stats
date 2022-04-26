/**
 * Adapted from example in multiple sites on web
 */

const path = require("path");
const express = require("express");

const { Pool } = require("pg"); // connecting to postgres
const {
  CommandCompleteMessage,
  closeComplete,
} = require("pg-protocol/dist/messages");
const pool = new Pool({
  user: "dbuser",
  host: "localhost",
  database: "rocket",
  password: "12345678",
  port: 5432,
});

console.log("Created pool ", pool);

const app = express();

const port = 30005;

// static pages are in a directory named public where node was started
app.use("/", express.static(path.join(__dirname)));

function dbreq1(dberr, client, done, req, res) {
  if (dberr) {
    res.writeHead(500);
    res.end(
      "Sorry, check with the site admin for error: " + dberr.code + " ..\n"
    );
    return;
  }
  let postt = req.body;
  console.log(postt);
  console.log("POST[count]", postt["count"]);

  client.query(
    "SELECT * from vehicle order by random() limit " + postt["count"],
    function (dberr, dbres) {
      done();
      if (dberr) {
        res.writeHead(500);
        res.end(
          "Sorry, check with the site admin for error: " + dberr.code + " ..\n"
        );
      } else {
        //res.writeHead(200, { 'Content-Type': 'application/json' });
        res.json(dbres.rows);
      }
    }
  );
}

// a request coming in as from fetch
// so it is json and returns json
app.post("/dq1", express.json({ type: "*/*" }), function (req, res) {
  console.log("getting dq1");
  console.log(req.body);
  pool.connect(function (dberr, client, done) {
    dbreq1(dberr, client, done, req, res);
  });
});

function dbreq2(dberr, client, done, req, res) {
  console.log("dbreq1");
  if (dberr) {
    res.writeHead(500);
    res.end(
      "Sorry, check with the site admin for error: " + dberr.code + " ..\n"
    );
    return;
  }
  postt = req.body;
  client.query(
    "SELECT * from vehicle order by random() limit " + postt["count"],
    function (dberr, dbres) {
      done();
      if (dberr) {
        res.writeHead(500);
        res.end(
          "Sorry, checkkkk with the site admin for error: " +
            dberr.code +
            " ..\n"
        );
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        let str = "<html><body>";

        let tbl = '<table border="1">';
        let ee = dbres.rows[0];
        tbl += "<tr>";
        Object.keys(ee).forEach((k) => {
          tbl += "<th>" + k + "</th>";
        });
        tbl += "</tr>";
        dbres.rows.forEach((element) => {
          console.log(element);
          tbl += "<tr>";
          Object.keys(element).forEach((k) => {
            //console.log(k, element[k]);
            tbl += "<td>" + element[k] + "</td>";
          });
          tbl += "</tr>";
        });
        tbl += "</table>";
        str += tbl + "</body></html>";
        res.end(str);
      }
    }
  );
}

// a request coming in as from a form
// so it is url encoded and returns an entire page
app.post("/dq2", express.urlencoded({ type: "*/*" }), function (req, res) {
  console.log(req.body);
  pool.connect(function (dberr, client, done) {
    dbreq2(dberr, client, done, req, res);
  });
});

app.listen(port, function (error) {
  if (error) throw error;
  console.log("Server created Successfully");
});
