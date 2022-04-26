/**
 * adapted from @gtowell
 * To start: UNIX> nohup node se_node.js &
 *           nohup allows things to run in background, smoothly
 */

const path = require("path");
const express = require("express");
const url = require('url');
const { Pool } = require("pg"); // connecting to postgres
const {
    CommandCompleteMessage,
    closeComplete,
} = require("pg-protocol/dist/messages");
const mustache = require("mustache");



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
const port = 40967;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

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

function init_gms(dberr, client, done, req, res) {
    if (dberr) {
        res.writeHead(500);
        res.end(
            "Sorry, check with the site admin for error: " + dberr.code + " ..\n"
        );
        return;
    }

    client.query("SELECT * from gm_list;", function (dberr, dbres) {
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

app.post("/players", express.json({ type: "*/*" }), function (req, res) {
    pool.connect(function (dberr, client, done) {
        init_players(dberr, client, done, req, res);
    });
});

app.post("/gms", express.json({ type: "*/*" }), function (req, res) {
    pool.connect(function (dberr, client, done) {
        init_gms(dberr, client, done, req, res);
    });
});

// TODO
function getrendered(strings) {
    let params = {
        headers: { "Content-type": "text/plain" }
    }
    fetch('views/onegame_view', params).then((response) => response.text())
        .then((template) => {
            let rendered = mustache.render(template, strings);
            return rendered
        });
}

app.get("/one_game", function (req, res) {
    console.log(req.url)
    let url_parts = url.parse(req.url, true);
    let query = url_parts.query["game-select"];

    pool.connect(async function (dberr, client, done) {

        let game_query = `SELECT * FROM game_view WHERE game_string LIKE '${query}';`
        let data_query = `SELECT * FROM data_view WHERE game_string LIKE '${query}';`;
        let gm_query = `SELECT * FROM gm_list WHERE game_string LIKE '${query}';`

        let game_info = await client.query(game_query);
        let data_info = await client.query(data_query);
        let gm_info = await client.query(gm_query);

        console.log(game_info.rows[0])

        opts = {
            game_info: game_info.rows[0],
            data_info: data_info.rows,
            gm_info: gm_info
        }

        let strings = parseGameData(opts)

        //let rendered = getrendered(strings)
        let rendered = mustache.render(template, strings)

        res.write(rendered)

        console.log("written :)");

        res.end()
    });
})




// start the Node server
app.listen(port, function (error) {
    if (error) throw error;
    console.log(`Server created Successfully on port ${port}`);
});


function parseGameData(opts) {
    let game_info = opts["game_info"]
    let data_info = opts["data_info"]
    let gm_info = opts["gm_info"]
    // TODO: actual wanted link
    let title_string = `<h1 class="bg-primary py-2">
            ${game_info.game_string}- 
            <u><a class="text-light" 
                href="https://www.17thshard.com/forum/topic/4985-long-game-1-in-the-wake-of-the-koloss/">
                ${game_info.title}
            </a></u>
            </h1>`;

    let game_info_string = `<ul> 
        <li>GM(s): <strong>${gm_info}</strong></li> 
        <li><strong>${data_info.length}</strong> players</li> 
        <li><strong>${game_info.num_cycles}</strong> cycles</li> 
        <li><strong>${game_info.num_posts}</strong> posts</li> 
        <li>Setting: ${game_info.setting} </li> 
        <li> Complexity: ${game_info.complexity}</li> 
        <li> Fundamentals: ${game_info.fundamentals}</li> 
        </ul>`;

    nicer_data = data_info.map((d) => {
        return {
            Name: d.player_name,
            Won: d.win ? "Y" : "N",
            Alignment: d.is_elim ? "Evil" : d.alignment_desc,
            Death: d.death_char === "F" ? "Friendly Fire" : d.death_desc,
            "1st hit": d.first_hit === null ? "-" : d.first_hit,
            "Last hit": d.last_hit === null ? "-" : d.last_hit,
            "# Hits": d.num_hits,
        };
    });

    let table_string = makeTable(nicer_data);

    return {
        "title": title_string,
        "info": game_info_string,
        "table": table_string
    }
}


/**
 * Create an html table from a bunch of data in JSON form.
 * Where the JSON form is an array of objects
 * @param dbres -- the JSON data
 * @returns an HTML table
 */
function makeTable(dbres) {
    let tbl = '<table class="table table-striped table-sm">';
    let dbkeys = Object.keys(dbres[0]);
    tbl += "<thead><tr>";
    // first, format the table header.
    // each item in the header is a key in the first JSON object
    // each of these is turned into a button that sorts the JSON data on that key
    dbkeys.forEach((k) => {
        tbl += `
          <th>
          <div class="d-grid gap-">
          <button 
              type="button" 
              class="btn btn-secondary" 
              onclick='doReSort("${k}")'
          >
              <strong>${k}</strong> 
          </button>
          </div>
          </th>`;
    });

    // next make function body
    tbl += "</tr></thead><tbody>";
    dbres.forEach((element) => {
        tbl += "<tr>";
        dbkeys.forEach((k) => {
            // hmm
            if (k === "Game") {
                tbl += `<td
              class="${k} ${element[k]}"
              onclick='examineGame("${element[k]}")'>
              
              ${element[k]}
              
              </td>`;
            } else {
                tbl += `<td
                  class="${k} ${element[k]}">
                  ${element[k]}
                  </td>`;
            }
        });
        tbl += "</tr>";
    });
    tbl += "</tbody></table>";
    return tbl;
}

// TODO: YIKES
let template = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

  <title>SE Statistics</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6" crossorigin="anonymous" />
  <link rel="stylesheet" href="./style.css" />
</head>

<body>
  <!-- NAVBAR -->
  <nav class="navbar navbar-dark bg-primary navbar-expand-lg flex-md-nowrap shadow p-0 m-0">
    <div class="container-fluid my-0 py-0">
      <a class="navbar-brand" href="index.html">Sanderson Elimination Statistics</a>

      <div class="collapse navbar-collapse" id="navbarToggle">
        <div class="navbar-nav">
          <a class="nav-link active" href="index.html">Full Data</a>
          <a class="nav-link" href="one_game.html">View a Game</a>
          <a class="nav-link" href="one_player.html">View a Player</a>
        </div>
      </div>
      <a class="nav-link" href="#">Switch to Mongo</a>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggle"
        aria-controls="navbarToggle" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>
  </nav>

  <!-- select -->
  <div class="container jumbotron">
    
      <form method="get" action="one_game"><div class="row ">
        <div class="col-3">
          <select class="form-select" aria-label="Default select example" id="game-select" name="game-select">
            <option selected>{{selected_game}}</option>
          </select>
        </div>
      
      <div class="col-5">
        <button type="submit" class="btn btn-primary" onclick="g2()">
          Submit
        </button>
      </div>
</form>
    </div>
  </div>

  <!-- output -->
  <div class="container">
    <div class="row" id="output">
      <div class="col-12">
        {{{title}}}
      </div>

      <div class="col-3 col-xs-6 justify-content-top" id="game-info">
        {{{info}}}
      </div>

      <div class="col-9 col-xs-12" id="output-table">
        {{{table}}}
      </div>
    </div>
    <br />
  </div>

  <!-- FOOTER -->
  <footer class="footer">
    <span class="bottom">Isabelle Sanford |</span>
    <a class="footer-data text-dark"
      href="https://docs.google.com/spreadsheets/d/1CxrgdT4Xd8J0N3CuVmkVRryMeIdm93H8rzv8-YlP0kw" title="Original Data"
      target="_blank"><i class="fa fa-fw fa-2x fa-cloud-download"></i><span>Original Data (Stats Sheet)</span></a>
    <!-- target="_blank" opens data page in new tab >>> remove if we keep href as data.html -->
  </footer>

  <!-- SCRIPTS -->
  <!-- bootstrap -->
  <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
    integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
    crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-JEW9xMcG8R+pH31jmWH6WWP0WintQrMb4s7ZOdauHnUtxwoG2vI5DkLtS3qm9Ekf"
    crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.5.0/d3.js"></script>

  <!-- d3 - might need for bootstrap? -->
  <script src="https://d3js.org/d3.v5.min.js"></script>

  <!-- plotly -->
  <!-- <script src="https://cdn.plot.ly/plotly-latest.min.js"></script> -->

  <!-- MINE -->
  <script type="text/javascript" src="js/init_utils.js"></script>
  <script type="text/javascript" src="js/one_game.js"></script>
  <script type="text/javascript" src="js/end_utils.js"></script>
</body>

</html>`;