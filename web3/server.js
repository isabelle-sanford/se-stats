const path = require("path");
const express = require("express");
const url = require("url");
const { Pool } = require("pg"); // connecting to postgres
const {
  CommandCompleteMessage,
  closeComplete,
} = require("pg-protocol/dist/messages");
const tl = require('express-tl')


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

let result = null;
let nicer_data = null;
const one_game_page = `http://165.106.10.170:${port}/one_game`;
const one_player_page = `http://165.106.10.170:${port}/one_player`;




app.engine('tl', tl)
app.set('views', './views') // specify the views directory
app.set('view engine', 'tl') // register the template engine


app.use("/", express.static(path.join(__dirname)));


let empty_1game_page = {
  selected_game: "LG1", // okay? maybe? 
  title: "",
  info: "",
  table: "Please select a game :)"
}

app.get("/one_game", function (req, res) {
  console.log(req.url);
  let url_parts = url.parse(req.url, true);
  let query = url_parts.query["game"];
  console.log(query)

  if (query === undefined) {
    res.render("onegame_view", empty_1game_page)
    res.end()
    return;
  }
  console.log("connecting")

  pool.connect(async function (dberr, client, done) {
    let game_query = `SELECT * FROM game_view WHERE game_string LIKE '${query}';`;
    let data_query = `SELECT * FROM data_view WHERE game_string LIKE '${query}';`;
    let gm_query = `SELECT * FROM gm_list WHERE game_string LIKE '${query}';`;

    let game_info = await client.query(game_query);
    let data_info = await client.query(data_query);
    let gm_info = await client.query(gm_query);

    console.log(gm_info);

    if (game_info.rows.length === 0) {
      res.render("onegame_view", empty_1game_page)
      res.end()
      return;
    }

    // if there are two games with same string that's BAD
    let strings = parseGameData(game_info.rows[0], data_info.rows, gm_info.rows);

    strings["selected_game"] = query;

    res.render("onegame_view", strings);
  });
});


let empty_1player_page = {
  selected_game: "Meta",
  title: "",
  info: "",
  table: "Please select a player! :)" // doesn't look great
}

app.get("/one_player", function (req, res) {
  console.log(req.url);
  let url_parts = url.parse(req.url, true);
  let query = url_parts.query["player"];
  console.log(query)

  if (query === undefined) {
    res.render("oneplayer_view", empty_1player_page)
    res.end()
    return;
  }
  console.log("connecting")

  pool.connect(async function (dberr, client, done) {
    let data_query = `SELECT * FROM data_view WHERE player_name LIKE '${query}';`;
    let gm_query = `SELECT * FROM gm_list WHERE player_name LIKE '${query}';`;

    let data_info = await client.query(data_query);
    let gm_info = await client.query(gm_query);

    console.log(data_info.rowCount);

    if (data_info.rows.length === 0) {
      res.render("oneplayer_view", empty_1player_page)
      res.end()
      return;
    }

    let strings = parsePlayerData(data_info.rows, gm_info.rows);

    strings["title"] = `<h1 class="bg-primary py-1">${query}</h1><br>`;

    strings["selected_player"] = query;

    res.render("oneplayer_view", strings);
  });
});


/**
 * INITIAL DATA LISTS FOR DROPDOWNS
 */

app.post("/gamelist", express.json({ type: "*/*" }), function (req, res) {
  pool.connect(function (dberr, client, done) {
    init_gamedata(dberr, client, done, req, res);
    console.log("game data loaded, in theory");
  });
});
function init_gamedata(dberr, client, done, req, res) {
  if (dberr) {
    res.writeHead(500);
    res.end(
      "Sorry, check with the site admin for error: " + dberr.code + " ..\n"
    );
    return;
  }

  client.query("SELECT game_string from game_view;", function (dberr, dbres) {
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
app.post("/players", express.json({ type: "*/*" }), function (req, res) {
  pool.connect(function (dberr, client, done) {
    init_players(dberr, client, done, req, res);
  });
});

app.listen(port, function (error) {
  if (error) throw error;
  console.log(`Server created Successfully on port ${port}`);
});


/*
PARSING FUNCTIONS---------
*/

function parsePlayerData(data_info, gm_info) {
  let num_games = data_info.length;
  let n_evil = data_info.filter((p) => p.is_elim).length;
  let n_won = data_info.filter((p) => p.win).length;
  let n_survived = data_info.filter((p) => p.death_char === "S").length;

  // TODO make my own round function >:(
  let player_info_string = `<ul>
    <li># Games Played: <strong>${num_games}</strong></li>
    <li># Evil: ${n_evil} (${avg(n_evil, num_games)} %) 
    </li>
    <li># Won: ${n_won} (${avg(n_won, num_games)}%) 
    </li>
    <li># Survived: ${n_survived} (${avg(n_survived, num_games)}%) </li>
    </ul>`;

  if (gm_info.length > 0) {
    let gm_info_string = `<br><strong>${gm_info.length}</strong> Games GMed:
        <ul> ${gm_info
        .map((g) => "<li>" + g.game_string + "</li>")
        .join(" ")} </ul>`;

    player_info_string += gm_info_string;
  }

  nicer_data = data_info.map((p) => {
    return {
      Game: p.game_string,
      Won: p.win ? "Y" : "N",
      Alignment: p.alignment_char === "E" ? "Evil" : p.alignment_desc,
      Death: p.death_char === "F" ? "Friendly Fire" : p.death_desc,
      "1st hit": p.first_hit === null ? "0" : p.first_hit, // yikes
      "Last hit": p.last_hit === null ? "0" : p.last_hit,
      "# Hits": p.num_hits === null ? "-" : p.num_hits,
    };
  });

  return {
    info: player_info_string,
    table: makeTable(nicer_data)
  }


}

function parseGameData(game_info, data_info, gm_info) {
  // TODO: actual wanted link
  let title_string = `<h1 class="bg-primary py-2">
            ${game_info.game_string}- 
            <u><a class="text-light" 
                href="https://www.17thshard.com/forum/topic/4985-long-game-1-in-the-wake-of-the-koloss/">
                ${game_info.title}
            </a></u>
            </h1>`;

  let game_info_string = `<ul> 
        <li>GM(s): <strong>${gm_info.map(d => d.player_name).join(", ")}</strong></li> 
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
    title: title_string,
    info: game_info_string,
    table: table_string,
  };
}


/*
UTILITY FUNCTIONS--------------
*/

// adapted (heavily) from @gtowell
function makeTable(dbres) {
  let tbl = '<table class="table table-striped table-sm sortable">';
  let dbkeys = Object.keys(dbres[0]);
  tbl += "<thead><tr>";
  //format the table header
  dbkeys.forEach((k) => {
    tbl += `<th>
          <button type="button" class="btn btn-secondary" >
            <strong>${k}</strong> 
          </button>
          </th>`;
  });

  // next make function body
  tbl += "</tr></thead><tbody>";
  dbres.forEach((element) => {
    tbl += "<tr>";
    dbkeys.forEach((k) => {
      // hmm
      if (k === "Game") {
        let linky = `${one_game_page}?game=${element[k].trim()}+++`; // >:(
        tbl += `<td
            class="${k} ${element[k]}">
            <a href="${linky}">
            ${element[k]}
            </a>
            </td>`;
      } else if (k === "Name") {
        let linky = `${one_player_page}?player=${element[k]}`; // >:(
        tbl += `<td
              class="${k} ${element[k]}">
              <a href="${linky}">
              ${element[k]}
              </a>
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


function round(num) {
  return Math.round(num * 100) / 100;
}

function avg(num, sum) {
  return Math.round(num * 1000 / sum) / 10;
}