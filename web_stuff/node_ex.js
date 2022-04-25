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
const port = 40968; // 40969 stuck??

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

  client.query("SELECT * from data_view;", function (dberr, dbres) {
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

function init_players(dberr, client, done, req, res) {
  if (dberr) {
    res.writeHead(500);
    res.end(
      "Sorry, check with the site admin for error: " + dberr.code + " ..\n"
    );
    return;
  }

  //   let postt = req.body;

  client.query("SELECT player_name from player", function (dberr, dbres) {
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

function init_gamedata(dberr, client, done, req, res) {
  if (dberr) {
    res.writeHead(500);
    res.end(
      "Sorry, check with the site admin for error: " + dberr.code + " ..\n"
    );
    return;
  }

  //   let postt = req.body;

  client.query("SELECT * from game_view;", function (dberr, dbres) {
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
function dbreq1(dberr, client, done, req, res, queryString) {
  if (dberr) {
    res.writeHead(500);
    res.end(
      "Sorry, check with the site admin for error: " + dberr.code + " ..\n"
    );
    return;
  }
  let postt = req.body;
  client.query(
    queryString, // !
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
app.post("/data", express.json({ type: "*/*" }), function (req, res) {
  pool.connect(function (dberr, client, done) {
    init_dbreq(dberr, client, done, req, res);
    console.log("data loaded, in theory");
  });
});

app.post("/games", express.json({ type: "*/*" }), function (req, res) {
  pool.connect(function (dberr, client, done) {
    init_gamedata(dberr, client, done, req, res);
    console.log("game data loaded, in theory");
  });
});

// tell express aboout how to handle the dq1 request
app.post("/players", express.json({ type: "*/*" }), function (req, res) {
  pool.connect(function (dberr, client, done) {
    init_players(dberr, client, done, req, res);
  });
});

// tell express aboout how to handle the dq1 request
app.post("/dq1", express.json({ type: "*/*" }), function (req, res) {
  pool.connect(function (dberr, client, done) {
    dbreq1(dberr, client, done, req, res);
  });
});


function getQuery(dberr, client, done, req, res) {
  if (dberr) {
    res.writeHead(500);
    res.end(
      "Sorry, check with the site admin for error: " + dberr.code + " ..\n"
    );
    return;
  }

  let postt = req.body;

  console.log(postt)

  let queryString = "SELECT * FROM data_view WHERE TRUE ";
  if (postt["player-select"] != "All") {
    queryString += "AND player_name LIKE '" + postt["player-select"] + "' "
  }
  // if (!postt["LGcheck"] || !postt["MRcheck"] || !postt["QFcheck"]) {
  //   queryString += "AND ( "
  //   if (postt["LGcheck"]) {
  //     queryString += "game_format LIKE 'LG' OR "
  //   }
  //   if (postt["MRcheck"]) {
  //     queryString += "game_format LIKE 'MR' OR "
  //   }
  //   if (postt["QFcheck"]) {
  //     queryString += "game_format LIKE 'QF' OR "
  //   }
  //   queryString += " FALSE)"
  // }

  queryString += ";"

  console.log(queryString)


  client.query(
    queryString, // !
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



// a request coming in as from a form
// so it is url encoded and returns an entire page
app.post('/forminput', express.urlencoded({ type: '*/*' }), function (req, res) {
  console.log(req.body);
  pool.connect(function (dberr, client, done) {
    getQuery(dberr, client, done, req, res)
  });
});



// start the Node server
app.listen(port, function (error) {
  if (error) throw error;
  console.log(`Server created Successfully on port ${port}`);
});
