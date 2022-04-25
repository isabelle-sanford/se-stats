

//queryData();




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
      result = JSON.parse(text);
      console.log(result[0]);

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

      let num_games = result.length;

      let sum_posts = 0
      result.map(p => p.num_posts).forEach(n => sum_posts += n)

      let sum_cycles = 0
      result.map(p => p.num_cycles).forEach(n => sum_cycles += n)

      let summary_string = `<ul>
      <li>${num_games} games </li>
      <li>${Math.round(sum_posts / num_games)} posts on average </li>
      <li>${Math.round(sum_cycles / num_games * 100) / 100} cycles on average</li>
       </ul>`
      console.log(sum_posts)
      document.querySelector("#output-stats").innerHTML = summary_string

    });
  });
}

