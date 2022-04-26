queryData();

let table_output = document.querySelector("#output-table");
let ind_output = document.querySelector("#output");

let result = null;
let nicer_data = null;

// data input
let LG_choiceD = document.querySelector("#LGcheck");
let MR_choiceD = document.querySelector("#MRcheck");
let QF_choiceD = document.querySelector("#QFcheck");

function q2() {
  let params = {
    method: "GET",
    headers: { "Content-type": "application/json" },
  };
  let content = {}
  const formData = new FormData(document.querySelector('#get-one-game'));
  console.log("This is the form data:");

  for (const pair of formData.entries()) {
    content[pair[0]] = pair[1];
  }

  params['body'] = JSON.stringify(content);
  console.log(formData)
  console.log(content)
}

function queryData() {
  let params = {
    method: "POST",
    headers: { "Content-type": "application/json" },
  };

  // params["body"] = JSON.stringify({}); // !
  fetch(data_url, params).then(function (response) {
    response.text().then(function (text) {
      result = JSON.parse(text);

      if (!LG_choiceD.checked) {
        result = result.filter((pt) => pt.game_format !== "LG");
      }
      if (!MR_choiceD.checked) {
        result = result.filter((pt) => pt.game_format !== "MR");
      }
      if (!QF_choiceD.checked) {
        result = result.filter((pt) => pt.game_format !== "QF");
      }

      nicer_data = result.map((pt) => {
        return {
          Name: pt.player_name,
          Game: pt.game_string,
          Won: pt.win,
          Alignment: pt.alignment_char,
          Death: pt.death_char,
          "First hit": pt.first_hit,
          "Last hit": pt.last_hit,
          "# Hits": pt.num_hits,
        };
      });

      console.log(result[0]);

      table_output.innerHTML = makeTable(nicer_data);
    });
  });
}

// games input
let LG_choiceG = document.querySelector("#LGcheckG");
let MR_choiceG = document.querySelector("#MRcheckG");
let QF_choiceG = document.querySelector("#QFcheckG");

function queryGames() {
  let params = {
    method: "POST",
    headers: { "Content-type": "application/json" },
  };
  params["body"] = JSON.stringify({}); // !
  fetch(games_url, params).then(function (response) {
    response.text().then(function (text) {
      result = JSON.parse(text);

      // Maybe split this stuff out into func that returns dict to filter by?

      if (!LG_choiceG.checked) {
        result = result.filter((pt) => pt.game_format !== "LG");
      }
      if (!MR_choiceG.checked) {
        result = result.filter((pt) => pt.game_format !== "MR");
      }
      if (!QF_choiceG.checked) {
        result = result.filter((pt) => pt.game_format !== "QF");
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

      nicer_data = result.map((pt) => {
        return {
          Game: pt.game_string,
          Title: pt.title,
          "# Cycles": pt.num_cycles,
          Complexity: pt.complexity,
          Fundamentals: pt.fundamentals,
          Setting: pt.setting,
          "# Posts": pt.num_posts,
        };
      });

      table_output.innerHTML = makeTable(nicer_data);

      //
      let num_games = result.length;

      let sum_posts = 0;
      result.map((p) => p.num_posts).forEach((n) => (sum_posts += n));

      let sum_cycles = 0;
      result.map((p) => p.num_cycles).forEach((n) => (sum_cycles += n));

      let summary_string = `<ul>
      <li>${num_games} games </li>
      <li>${Math.round(sum_posts / num_games)} posts on average </li>
      <li>${Math.round((sum_cycles / num_games) * 100) / 100
        } cycles on average</li>
       </ul>`;
      document.querySelector("#output-stats").innerHTML = summary_string;
    });
  });
}
