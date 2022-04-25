


function fillPlayerDropdown() {
  let dropdown = document.querySelector("#player-select");

  let params = {
    method: "POST",
    headers: { "Content-type": "application/json" },
  };
  let uurl = `http://165.106.10.170:${port}/players`;
  params["body"] = JSON.stringify({}); // pass the param "count" using post
  fetch(uurl, params).then(function (response) {
    response.text().then(function (text) {
      let result = JSON.parse(text);
      console.log(result);

      let opt = "<option value=\"All\" selected>All</option>";
      result.forEach(name => {
        opt += "<option value=\"" + name.player_name + "\" >" + name.player_name + "</option>";
      })

      dropdown.innerHTML = opt;
    });
  });
}

function fillGameDropdown() {
  let dropdown = document.querySelector("#game-select");

  let params = {
    method: "POST",
    headers: { "Content-type": "application/json" },
  };
  let uurl = `http://165.106.10.170:${port}/games`;
  params["body"] = JSON.stringify({});
  fetch(uurl, params).then(function (response) {
    response.text().then(function (text) {
      let result = JSON.parse(text);
      console.log(result);

      let opt = ""//<option value=\"All\" selected>All</option>";
      result.forEach(game => {
        opt += "<option value=\"" + game.game_string + "\" >" + game.game_string + "</option>";
      })

      dropdown.innerHTML = opt;
    });
  });
}


// INITIAL SETUP

fillPlayerDropdown();

fillGameDropdown();

queryGames();




let table_output = document.querySelector("#output-table")
let ind_output = document.querySelector("#output")

let result = null
let nicer_data = null

/**
 * Do a query.  This just calls a fairly static query on the rocket database.
 * Each time it is called, it gets one more random rocket than the previous time
 */
function queryData() {
  let params = {
    method: "POST",
    headers: { "Content-type": "application/json" },
  };
  let uurl = `http://165.106.10.170:${port}/data`;
  params["body"] = JSON.stringify({}); // !
  fetch(uurl, params).then(function (response) {
    response.text().then(function (text) {
      original_result = JSON.parse(text);
      console.log(original_result[0]);


      // Maybe split this stuff out into func that returns dict to filter by? 
      let player_chosen = document.querySelector("#player-select").value;
      if (player_chosen !== "All") {
        console.log("filtering to " + player_chosen)
        result = original_result.filter(pt => pt.player_name == player_chosen)
      } else {
        result = original_result
      }

      let LG_choice = document.querySelector("#LGcheck");
      let MR_choice = document.querySelector("#MRcheck");
      let QF_choice = document.querySelector("#QFcheck");

      console.log(LG_choice.checked)

      if (!LG_choice.checked) {
        result = result.filter(pt => pt.game_format !== "LG")
      }
      if (!MR_choice.checked) {
        result = result.filter(pt => pt.game_format !== "MR")
      }
      if (!QF_choice.checked) {
        result = result.filter(pt => pt.game_format !== "QF")
      }

      nicer_data = result.map(pt => {
        return {
          "Name": pt.player_name,
          "Game": pt.game_string,
          "Won": pt.win,
          "Alignment": pt.alignment_char,
          "Death": pt.death_char,
          "First hit": pt.first_hit,
          "Last hit": pt.last_hit,
          "# Hits": pt.num_hits,
        }
      })

      console.log(result[0])

      table_output.innerHTML = tabform1(nicer_data);

    });
  });

}

function queryGames() {
  let params = {
    method: "POST",
    headers: { "Content-type": "application/json" },
  };
  let uurl = `http://165.106.10.170:${port}/games`;
  params["body"] = JSON.stringify({}); // !
  fetch(uurl, params).then(function (response) {
    response.text().then(function (text) {
      original_result = JSON.parse(text);
      console.log(original_result[0]);


      // Maybe split this stuff out into func that returns dict to filter by? 
      // let game_chosen = document.querySelector("#game-select").value;
      // if (game_chosen !== "All") {
      //   console.log("filtering to " + game_chosen)
      //   result = original_result.filter(pt => pt.game_string == game_chosen)
      // } else {
      result = original_result
      // }

      let LG_choice = document.querySelector("#LGcheckG");
      let MR_choice = document.querySelector("#MRcheckG");
      let QF_choice = document.querySelector("#QFcheckG");

      console.log(LG_choice.checked)

      if (!LG_choice.checked) {
        result = result.filter(pt => pt.game_format !== "LG")
      }
      if (!MR_choice.checked) {
        result = result.filter(pt => pt.game_format !== "MR")
      }
      if (!QF_choice.checked) {
        result = result.filter(pt => pt.game_format !== "QF")
      }

      // let Village_win = document.querySelector("#VillageWinCheck");
      // let Elim_win = document.querySelector("#ElimWinCheck");
      // let Faction_win = document.querySelector("#FactionWinCheck");
      // let Neutral_win = document.querySelector("#NeutralWinCheck");
      // let Other_win = document.querySelector("#OtherWinCheck");

      // if (!Village_win.checked) {
      //   result = result.filter(pt => pt.)
      // }

      // game_id, game_format, game_string, anon_num, mechanics_balance, distribution_balance, player_name as IM, num_cycles, setting, is_sanderson, is_cosmere, complexity, fundamentals, num_posts, role_madness, title

      nicer_data = result.map(pt => {
        return {
          "Game": pt.game_string,
          "Title": pt.title,
          "# Cycles": pt.num_cycles,
          "Complexity": pt.complexity,
          "Fundamentals": pt.fundamentals,
          "Setting": pt.setting,
          "# Posts": pt.num_posts,
        }
      });

      console.log(result[0])

      table_output.innerHTML = tabform1(nicer_data);

    });
  });
}


function gamedata1(game_chosen) {
  let params = {
    method: "POST",
    headers: { "Content-type": "application/json" },
  };
  let uurl = "http://165.106.10.170:40968/games";
  params["body"] = JSON.stringify({}); // !
  fetch(uurl, params).then(function (response) {
    response.text().then(function (text) {
      original_result = JSON.parse(text);
      console.log(original_result[0]);

      result = original_result.filter(pt => pt.game_string == game_chosen)

      return result;
    });
  });
}

function gamedata2(game_chosen) {
  let params = {
    method: "POST",
    headers: { "Content-type": "application/json" },
  };
  let uurl = "http://165.106.10.170:40968/data";
  params["body"] = JSON.stringify({}); // !
  fetch(uurl, params).then(function (response) {
    response.text().then(function (text) {
      original_result = JSON.parse(text);
      console.log(original_result[0]);


      result = original_result.filter(pt => pt.game_string == game_chosen)

      return result;
    });
  });
}

function parseGameData(game_info, data_info, gm_info) {

  //let name_title = game_info.game_string + "- " + game_info.title
  document.querySelector("#game-name").innerHTML = `<h1 class="bg-primary text-center"> ${game_info.game_string}- ${game_info.title} </h1>`

  console.log(game_info)
  console.log(gm_info)

  let game_info_string = `<ul> 
    <li>GM(s): ${gm_info.map(d => d.player_name)}</li> 
    <li> # Players: ${data_info.length}</li> 
    <li># Cycles: ${game_info.num_cycles}</li> 
    <li> # Posts: ${game_info.num_posts}</li> 
    <li>Setting: ${game_info.setting} </li> 
    <li> Complexity: ${game_info.complexity}</li> 
    <li> Fundamentals: ${game_info.fundamentals}</li> 
    </ul>`

  document.querySelector("#game-info").innerHTML = game_info_string;


  let nicer_data = data_info.map(d => {
    return {
      "Name": d.player_name,
      "Won": d.win ? "Y" : "N",
      "Alignment": d.is_elim ? "Evil" : d.alignment_desc,
      "Death": d.death_char === "F" ? "Friendly Fire" : d.death_desc,
      "1st hit": d.first_hit === null ? "-" : d.first_hit,
      "Last hit": d.last_hit === null ? "-" : d.last_hit,
      "# Hits": d.num_hits
    }
  })
  document.querySelector("#player-info").innerHTML = tabform1(nicer_data);

  table_output.innerHTML = ""
}



function getGameData() {
  let game_chosen = document.querySelector("#game-select").value;
  console.log("filtering to " + game_chosen)

  let params = {
    method: "POST",
    headers: { "Content-type": "application/json" },
  };
  let uurl = `http://165.106.10.170:${port}/games`;
  params["body"] = JSON.stringify({}); // !
  fetch(uurl, params).then(function (response) {
    response.text().then(function (text) {
      game_res = JSON.parse(text).filter(pt => pt.game_string === game_chosen)[0];

      let dat_params = {
        method: "POST",
        headers: { "Content-type": "application/json" },
      };
      let dat_uurl = `http://165.106.10.170:${port}/data`;
      dat_params["body"] = JSON.stringify({}); // !
      fetch(dat_uurl, dat_params).then(function (response) {
        response.text().then(function (text) {
          data_res = JSON.parse(text).filter(pt => pt.game_string === game_chosen);


          let gm_params = {
            method: "POST",
            headers: { "Content-type": "application/json" },
          };
          let gm_uurl = `http://165.106.10.170:${port}/gms`;
          gm_params["body"] = JSON.stringify({}); // !
          fetch(gm_uurl, gm_params).then(function (response) {
            response.text().then(function (text) {
              gm_res = JSON.parse(text).filter(p => p.game_string === game_chosen);

              parseGameData(game_res, data_res, gm_res)
            });
          });





        });
      });
    });
  });

}

