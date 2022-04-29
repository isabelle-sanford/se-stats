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


const { MongoClient } = require('mongodb');
const uri = "mongodb://127.0.0.1/isanford";
const client = new MongoClient(uri, { useUnifiedTopology: true });

const app = express();
const port = 40967;

let result = null;
let nicer_data = null;
const one_game_page = `http://165.106.10.170:${port}/one_game`;
const one_player_page = `http://165.106.10.170:${port}/one_player`;
const one_game_pageM = `http://165.106.10.170:${port}/one_gameM`;
const one_player_pageM = `http://165.106.10.170:${port}/one_playerM`;



app.engine('tl', tl)
app.set('views', './views') // specify the views directory
app.set('view engine', 'tl') // register the template engine


app.use("/", express.static(path.join(__dirname)));

/** SINGLE THING PAGES */

let empty_1game_page = {
  selected_game: "LG1",
  title: "",
  info: "",
  table: "Please select a game :)"
}

app.get("/one_game", async function (req, res) {
  console.log(req.url);
  let url_parts = url.parse(req.url, true);
  let query = url_parts.query["game"];
  console.log("getting game: " + query)

  if (query === undefined) {
    res.render("onegame_view", empty_1game_page)
    res.end()
    return;
  }
  console.log("connecting")


  // pull out in sep func? 
  pool.connect(async function (dberr, client, done) {

    if (dberr) {
      console.log("????");
      return;
    }
    let game_query = `SELECT * FROM game_view WHERE game_string LIKE '${query}';`;
    let data_query = `SELECT * FROM data_view WHERE game_string LIKE '${query}';`;
    let gm_query = `SELECT * FROM gm_list WHERE game_string LIKE '${query}';`;

    let game_info = await client.query(game_query);
    let data_info = await client.query(data_query);
    let gm_info = await client.query(gm_query);
    done();

    console.log(gm_info);

    if (game_info.rows.length === 0) {
      res.render("onegame_view", empty_1game_page)
      res.end()
      return;
    }

    // if there are two games with same string that's BAD
    let strings = parseGameData(game_info.rows[0], data_info.rows, gm_info.rows);

    strings["selected_game"] = query;

    if (dberr) {
      console.log("!!!!");
      return;
    }

    res.render("onegame_view", strings);
  });
});

app.get("/one_gameM", async function (req, res) {
  console.log(req.url);
  let url_parts = url.parse(req.url, true);
  let query = url_parts.query["game"];
  console.log("getting game: " + query)

  if (query === undefined) {
    res.render("onegame_viewM", empty_1game_page)
    res.end()
    return;
  }
  console.log("connecting")


  let results = await queryMongo({ game_string: query }, 'games', client);

  console.log("results: ")
  console.log(results)

  // not sure this is the syntax
  if (results === null) {
    console.log("nothing found")
    res.render("onegame_viewM", empty_1game_page)
    res.end()
    return;
  }

  // hmm. out to bottom? 
  let strings = await parseGameDataMongo(results);
  console.log("rendering!")
  strings["selected_game"] = query;
  res.render("onegame_viewM", strings);
  return;


  // pull out in sep func? 


});


let empty_1player_page = {
  selected_player: "Meta",
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
    console.log("no query");
    res.render("oneplayer_view", empty_1player_page)
    res.end()
    return;
  }
  console.log("connecting")


  pool.connect(async function (dberr, client, done) {
    if (dberr) {
      console.log("????");
      return;
    }
    let data_query = `SELECT * FROM data_view WHERE player_name LIKE '${query}';`;
    let gm_query = `SELECT * FROM gm_list WHERE player_name LIKE '${query}';`;

    let data_info = await client.query(data_query);
    let gm_info = await client.query(gm_query);
    done();

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

app.get("/one_playerM", async function (req, res) {
  console.log(req.url);
  let url_parts = url.parse(req.url, true);
  let query = url_parts.query["player"];
  console.log(query)

  if (query === undefined) {
    res.render("oneplayer_viewM", empty_1player_page)
    res.end()
    return;
  }
  console.log("connecting")


  let results = await queryMongo({ player_name: query }, 'players', client);

  console.log(results);

  let strings = parsePlayerDataMongo(results)
  strings["selected_player"] = query;

  res.render("oneplayer_viewM", strings);
  return;
});

/** DATA TABLE PAGE */


app.get("/", function (req, res) {
  console.log("loading page...")
  res.render("index", {
    table: "",
    on_data_tab: "true",
    on_game_tab: "false",
  })
})

app.get("/index", function (req, res) {
  console.log("loading page...")
  res.render("index", {
    table: "",
    on_data_tab: "true",
    on_game_tab: "false",
  })
})

app.post("/index", express.urlencoded({ type: "*/*" }), function (req, res) {

  pool.connect(async function (dberr, client, done) {
    console.log("connection established");
    get_data(dberr, client, done, req, res);
  });
})

app.get("/indexM", function (req, res) {
  console.log("loading page...")
  res.render("indexM", {
    table: "",
    on_data_tab: "true",
    on_game_tab: "false",
    database: "Mongo" // OTHER database than current
  })
})

// ONLY for game tab
app.post("/indexM", express.urlencoded({ type: "*/*" }), async function (req, res) {

  console.log("request body: ")
  console.log(req.body);

  let query = buildGameQueryMongo(req.body);

  if (!query) {
    console.log("Bad query!")
    res.render("indexM", {
      table: "<p>You unchecked everything in a category! No games for you.</p>",
      on_data_tab: "false",
      on_game_tab: "true"
    })
    return
  }

  console.log("query is: " + query)

  let q_info = await queryMongo(query, 'games', client, false)

  console.log(q_info);

  if (q_info.length === 0) {
    console.log("No results? ")
    res.render("indexM", {
      table: "<p>No results found!</p>",
      on_data_tab: "false",
      on_game_tab: "true"
    })
    return
  }



  console.log("num returned:")
  console.log(q_info.length)

  console.log("first row queried: ")
  console.log(q_info[0])
  result = q_info;


  // account for null results! 
  nicer_data = result.map((pt) => {
    return {
      Game: pt.game_string,
      Title: pt.title,
      "# Cycles": isNaN(pt.num_cycles) ? "-" : pt.num_cycles,
      Complexity: String(pt.basics.complexity) == "NaN" ? "-" : pt.basics.complexity,
      Fundamentals: String(pt.basics.fundamentals) == "NaN" ? "-" : pt.basics.fundamentals,
      Setting: pt.setting.world, // exists for everyone? not sure
      "# Posts": isNaN(pt.num_posts) ? "-" : pt.num_posts,
      Winner: String(pt.winner) == "NaN" ? "-" : pt.winner,
      "# Players": isNaN(pt.player_stats.num_players) ? "-" : pt.player_stats.num_players,
      "GM(s)": pt.GMs.join(", ")
    };
  });

  console.log("nicened first row: ")
  console.log(nicer_data[0]);

  res.render("indexM", {
    table: makeTable(nicer_data),
    on_data_tab: "false",
    on_game_tab: "true"
  })

  console.log("rendered! ")

  res.end() // ??
  return

})


async function get_data(dberr, client, done, req, res) {
  if (dberr) {
    res.writeHead(500);
    res.end(
      "Sorry, check with the site admin for error: " + dberr.code + " ..\n"
    );
    return;
  }

  console.log("request body: ")
  console.log(req.body);

  let params = req.body;

  let query;
  let tab;
  if (params.tab === "on-game-tab") {
    tab = "game";
    query = buildGameQuery(params)
  } else if (params.tab === "on-data-tab") {
    tab = "data";
    query = buildDataQuery(params)
  } else {
    res.render("index", {
      table: "???",
      on_data_tab: "true",
      on_game_tab: "false"
    })
    console.log("No query??")
    return
  }

  console.log("query: ");
  console.log(query);

  if (!query) {
    console.log("Bad query!")
    res.render("index", {
      table: "That query won't return anything!",
      on_data_tab: "true",
      on_game_tab: "false"
    })
    return
  }

  let q_info = await client.query(query)

  done();

  console.log(q_info.rowCount)

  if (q_info.rowCount === 0) {
    console.log("No data found! ")
    res.render("index", {
      table: "No data found!",
      on_data_tab: "true",
      on_game_tab: "false"
    })
    return //idk
  }

  console.log("first row queried: ")
  console.log(q_info.rows[0])
  result = q_info.rows;

  if (tab === "game") {
    nicer_data = result.map((pt) => {
      return {
        Game: pt.game_string,
        Title: pt.title,
        "# Cycles": pt.num_cycles === null ? "-" : pt.num_cycles,
        Complexity: pt.complexity === null ? "-" : pt.complexity,
        Fundamentals: pt.fundamentals === null ? "-" : pt.fundamentals,
        Setting: pt.setting,
        "# Posts": pt.num_posts === null ? "-" : pt.num_posts,
      };
    });
  } else if (tab === "data") {
    nicer_data = result.map((pt) => {
      return {
        Name: pt.player_name,
        Game: pt.game_string,
        Won: pt.win === null ? "Draw" : pt.win ? "Y" : "N", // DRAWS
        Alignment: pt.alignment_desc,
        Death: pt.death_desc,
        "1st hit": pt.first_hit === null ? "-" : pt.first_hit,
        "Last hit": pt.last_hit === null ? "-" : pt.last_hit,
        "# Hits": pt.num_hits,
      };
    });
  }

  console.log("nicened first row: ")
  console.log(nicer_data[0]);

  res.render("index", {
    table: makeTable(nicer_data),
    on_data_tab: tab === "data" ? "true" : "false",
    on_game_tab: tab === "game" ? "true" : "false"
  })

  console.log("rendered! ")

  res.end() // ??
  return

}

/**
 * INITIAL DATA LISTS FOR DROPDOWNS
 */

// do I need to bother getting these from mongo? 
app.post("/gamelist", express.json({ type: "*/*" }), function (req, res) {
  pool.connect(function (dberr, client, done) {
    init_gamedata(dberr, client, done, req, res);
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

  let player_info_string = `<ul>
    <li><strong>${num_games}</strong> Games Played </li>
    <li>${n_evil} times evil (${avg(n_evil, num_games)} %) 
    </li>
    <li>${n_won} games won (${avg(n_won, num_games)}%) 
    </li>
    <li>${n_survived} games survived (${avg(n_survived, num_games)}%) </li>
    </ul>`;

  if (gm_info.length > 0) {
    let gm_info_string = `<br><strong>${gm_info.length}</strong> Game(s) GMed:
        <ul> ${gm_info
        .map((g) => "<li><a href=\"" + one_game_page + "?game=" + g.game_string + "\"/>" + g.game_string + "</a></li>")
        .join(" ")} </ul>`;

    player_info_string += gm_info_string;
  }

  nicer_data = data_info.map((p) => {
    return {
      Game: p.game_string,
      Won: p.win === null ? "Draw" : p.win ? "Y" : "N",
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
        <li>GM(s): <strong>${gm_info.map(g => {
    return "<a href=\"" + one_player_page + "?player=" + g.player_name + "\">" + g.player_name + "</a>"
  }).join(", ")}</strong></li> 
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
function makeTable(dbres, mongo = false) {
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
        let linky = `${mongo ? one_game_pageM : one_game_page}?game=${element[k]}`;
        tbl += `<td
            class="${k} ${element[k]}">
            <a href="${linky}">
            ${element[k]}
            </a>
            </td>`;
      } else if (k === "Name") {
        let linky = `${mongo ? one_player_pageM : one_player_page}?player=${element[k]}`;
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

function avg(num, sum) {
  return Math.round(num * 1000 / sum) / 10;
}

/** SQL QUERY BUILDERS */

// TODO: GMs and stuff!!
function buildGameQuery(params) {
  let query = "SELECT * FROM game_view WHERE TRUE AND "

  // format
  if (params.LGcheckG === undefined || params.MRcheckG === undefined || params.QFcheckG === undefined || params.AGcheckG === undefined || params.BTcheckG === undefined) {
    let exists = false;

    query += " (FALSE "

    if (params.LGcheckG !== undefined) {
      exists = true;
      query += `OR game_format LIKE 'LG' `
    }
    if (params.MRcheckG !== undefined) {
      exists = true;
      query += `OR game_format LIKE 'MR' `
    }
    if (params.QFcheckG !== undefined) {
      exists = true;
      query += `OR game_format LIKE 'QF' `
    }
    if (params.AGcheckG !== undefined) {
      exists = true;
      query += `OR game_format LIKE 'AG' `
    }
    if (params.BTcheckG !== undefined) {
      exists = true;
      query += `OR game_format LIKE 'BT' `
    }

    if (!exists) {
      console.log("all formats unchecked")
      return false;
    }
    // or and?
    query += ") AND "
  }


  // winners
  // TODO once data exists
  // if (params.VillageWinCheck === undefined || params.ElimWinCheck === undefined || params.FactionWinCheck === undefined || params.NeutralWinCheck === undefined || params.OtherWinCheck === undefined) {
  //   let exists = false;

  //   query += " (FALSE "

  //   if (params.VillageWinCheck !== undefined) {
  //     exists = true;
  //     query += ` OR winner LIKE 'V'`
  //   }
  //   if (params.ElimWinCheck !== undefined) {
  //     exists = true;
  //     query += ` OR winner LIKE ''`
  //   }
  //   if (params.FactionWinCheck !== undefined) {
  //     exists = true;
  //     query += ` OR winner LIKE 'F'`
  //   }
  //   if (params.NeutralWinCheck !== undefined) {
  //     exists = true;
  //     query += ` OR winner LIKE 'N'`
  //   }
  //   if (params.OtherWinCheck !== undefined) {
  //     exists = true;
  //     // !
  //     query += ` OR winner LIKE 'O'`
  //   }
  //   if (!exists) {
  //     console.log("all winners unchecked")
  //     return false;
  //   }
  //   query += ") AND "
  // }

  query += " TRUE;"

  return query
}

function buildDataQuery(params) {
  let query = "SELECT * FROM data_view WHERE TRUE AND "

  // format
  if (params.LGcheck === undefined || params.MRcheck === undefined || params.QFcheck === undefined || params.AGcheck === undefined || params.BTcheck === undefined) {
    let exists = false;

    query += " (FALSE "

    if (params.LGcheck !== undefined) {
      exists = true;
      query += `OR game_format LIKE 'LG' `
    }
    if (params.MRcheck !== undefined) {
      exists = true;
      query += `OR game_format LIKE 'MR' `
    }
    if (params.QFcheck !== undefined) {
      exists = true;
      query += `OR game_format LIKE 'QF' `
    }
    if (params.AGcheck !== undefined) {
      exists = true;
      query += `OR game_format LIKE 'AG' `
    }
    if (params.BTcheck !== undefined) {
      exists = true;
      query += `OR game_format LIKE 'BT' `
    }

    if (!exists) {
      console.log("all formats unchecked")
      return false;
    }
    // or and?
    query += ") AND "
  }

  // wins
  if (params.WinCheck === undefined || params.LoseCheck === undefined || params.DrawCheck === undefined) {
    let exists = false;

    query += "(FALSE "

    if (params.WinCheck !== undefined) {
      exists = true;
      query += ` OR win `
    }
    if (params.LoseCheck !== undefined) {
      exists = true;
      query += ` OR NOT win `
    }
    if (params.DrawCheck !== undefined) {
      exists = true;
      query += ` OR win IS NULL `
    }
    if (!exists) {
      console.log("all wins unchecked")
      return false;
    }
    query += ") AND "
  }

  // !! O
  // alignment
  if (params.VillageCheckD === undefined || params.ElimCheckD === undefined || params.FactionCheckD === undefined || params.NeutralCheckD === undefined || params.OtherAlignmentCheckD === undefined) {
    let exists = false;

    query += " (FALSE "

    if (params.VillageCheckD !== undefined) {
      exists = true;
      query += ` OR alignment_char LIKE 'G'`
    }
    if (params.ElimCheckD !== undefined) {
      exists = true;
      query += ` OR is_elim`
    }
    if (params.FactionCheckD !== undefined) {
      exists = true;
      query += ` OR alignment_char LIKE 'F'`
    }
    if (params.NeutralCheckD !== undefined) {
      exists = true;
      query += ` OR alignment_char LIKE 'N'`
    }
    if (params.OtherAlignmentCheckD !== undefined) {
      exists = true;
      // !
      query += ` OR alignment_char LIKE 'O'`
    }
    if (!exists) {
      console.log("all alignments unchecked")
      return false;
    }
    query += ") AND "
  }

  // death
  if (params.SurviveCheck === undefined || params.EKillCheck === undefined || params.ExeCheck === undefined || params.VigCheck === undefined || params.NeutralDeathCheck === undefined || params.OtherDeathCheck === undefined) {
    let exists = false;
    query += " (FALSE "

    if (params.SurviveCheck !== undefined) {
      exists = true;
      query += " OR death_char LIKE 'S'";
    }
    if (params.EKillCheck !== undefined) {
      exists = true;
      query += " OR death_char LIKE 'E' OR death_char LIKE 'M'";
    }
    if (params.ExeCheck !== undefined) {
      exists = true;
      query += " OR death_char LIKE 'X'";
    }
    if (params.VigCheck !== undefined) {
      exists = true;
      query += " OR death_char LIKE 'V' OR death_char LIKE 'F'";
    }
    if (params.NeutralDeathCheck !== undefined) {
      exists = true;
      query += " OR death_char LIKE 'N'";
    }
    if (params.OtherDeathCheck !== undefined) {
      exists = true;
      query += " OR death_char LIKE 'I' OR death_char LIKE 'O' OR death_char LIKE 'D' OR death_char LIKE 'P'";
    }

    if (!exists) {
      console.log("all deaths unchecked")
      return false;
    }

    query += " ) AND "

  }
  query += " TRUE;"

  return query

}

/** MONGO */

async function queryMongo(query, db, client, findOne = true) {
  try {

    console.log("connecting to mongo")
    await client.connect();

    console.log("connected!")
    let res;
    if (findOne) {
      res = await client.db().collection(db).findOne(query)
    } else {
      res = await client.db().collection(db).find(query).toArray()
    }

    return res

  } catch (e) {
    console.error(e);
  }
}

function parsePlayerDataMongo(results) {

  title_string = `<h1 class="bg-success py-1">${results.player_name}</h1><br>`;

  let num_games = results.games.length;
  // apparently mongo doesn't have is_elim :(
  let n_evil = results.games.filter((p) => p.alignment === "E").length;
  let n_won = results.games.filter((p) => p.result === "W").length;
  let n_survived = results.games.filter((p) => p.death === "S").length;

  let player_info_string = `<ul>
    <li><strong>${num_games}</strong> Games Played </li>
    <li>${n_evil} times evil (${avg(n_evil, num_games)} %) 
    </li>
    <li>${n_won} games won (${avg(n_won, num_games)}%) 
    </li>
    <li>${n_survived} games survived (${avg(n_survived, num_games)}%) </li>
    </ul>`;

  if (results.GMed !== undefined) {
    let gm_info_string = `<br><strong>${results.GMed.length}</strong> Game(s) GMed:
        <ul> ${results.GMed
        .map((g) => "<li><a href=\"" + one_game_pageM + "?game=" + g.game_string + "\"/>" + g.game_string + "</a></li>")
        .join(" ")} </ul>`;

    player_info_string += gm_info_string;
  }

  nicer_data = results.games.map((p) => {
    return {
      Game: p.game_string,
      Won: p.result === "D" ? "Draw" : p.result === "W" ? "Y" : "N", // draw
      Alignment: p.alignment === "E" ? "Evil" : p.alignment, // no description
      Death: p.death,
      // SHOULD just  not have them in the mongo database and check for existence
      "1st hit": isNaN(p.hits.first) ? "0" : p.hits.first, // yikes
      "Last hit": isNaN(p.hits.last) ? "0" : p.hits.last,
      "# Hits": isNaN(p.hits.num) ? "-" : p.hits.num,
      "Role(s)": p.roles.filter(p => String(p) != "NaN").join(", ")
    };
  });

  return {
    title: title_string,
    info: player_info_string,
    table: makeTable(nicer_data, true)
  }

}

async function parseGameDataMongo(results) {
  let title_string = `<h1 class="bg-success py-2">
  ${results.game_string}- 
  <u><a class="text-light" 
      href="https://www.17thshard.com/forum/topic/4985-long-game-1-in-the-wake-of-the-koloss/">
      ${results.title}
  </a></u>
  </h1>`;

  let game_info_string = `<ul> 
  <li>GM(s): <strong>${results.GMs.map(g => {
    return "<a href=" + one_player_pageM + "?player=" + g + ">" + g + "</a>"
  }).join(", ")
    }</strong></li> 
  <li><strong>${results.player_stats.player_list.length}</strong> players</li> 
  <li><strong>${results.num_cycles}</strong> cycles</li> 
  <li><strong>${results.num_posts}</strong> posts</li> 
  <li>Setting: ${results.setting.world} </li> 
  <li> Complexity: ${results.basics.complexity}</li> 
  <li> Fundamentals: ${results.basics.fundamentals}</li> 
  <li> Winner: ${results.winner}</li> 
  </ul>`;


  let nicer_data = results.player_stats.player_list.map(p => {
    return { "Name": p }
  })

  console.log(nicer_data)

  let table_string = makeTable(nicer_data, true)

  return {
    title: title_string,
    info: game_info_string,
    table: table_string
  }

}


function buildGameQueryMongo(params) {
  let query = {}

  // format
  if (params.LGcheckG === undefined || params.MRcheckG === undefined || params.QFcheckG === undefined || params.AGcheckG === undefined || params.BTcheckG === undefined) {
    let exists = false;

    let formats = []

    if (params.LGcheckG !== undefined) {
      exists = true;
      formats.push("LG")
    }
    if (params.MRcheckG !== undefined) {
      exists = true;
      formats.push("MR")
    }
    if (params.QFcheckG !== undefined) {
      exists = true;
      formats.push("QF")
    }
    if (params.AGcheckG !== undefined) {
      exists = true;
      formats.push("AG")
    }
    if (params.BTcheckG !== undefined) {
      exists = true;
      formats.push("BT")
    }

    if (!exists) {
      console.log("all formats unchecked")
      return false;
    }

    query["format"] = { $in: formats }

  }

  // winners
  // TODO once data exists
  if (params.VillageWinCheck === undefined || params.ElimWinCheck === undefined || params.FactionWinCheck === undefined || params.NeutralWinCheck === undefined || params.OtherWinCheck === undefined) {
    let exists = false;

    let alignments = []

    if (params.VillageWinCheck !== undefined) {
      exists = true;
      alignments.push("V")
    }
    if (params.ElimWinCheck !== undefined) {
      exists = true;
      alignments.push("E")
    }
    if (params.FactionWinCheck !== undefined) {
      exists = true;
      alignments.push("F")
    }
    if (params.NeutralWinCheck !== undefined) {
      exists = true;
      alignments.push("N")
    }
    if (params.OtherWinCheck !== undefined) {
      exists = true;
      // !
      alignments.push("O")
    }
    if (!exists) {
      console.log("all winners unchecked")
      return false;
    }

    query["winner"] = { $in: alignments }
  }

  return query
}