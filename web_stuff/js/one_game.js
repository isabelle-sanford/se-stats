function fillGameDropdown() {
  let dropdown = document.querySelector("#game-select");

  let params = {
    method: "POST",
    headers: { "Content-type": "application/json" },
  };
  params["body"] = JSON.stringify({});
  fetch(games_url, params).then(function (response) {
    response.text().then(function (text) {
      let result = JSON.parse(text);
      console.log(result);

      let opt = "";
      result.forEach((game) => {
        opt += `<option value="${game.game_string}"> ${game.game_string} </option> `;
      });

      dropdown.innerHTML = opt;
    });
  });
}

fillGameDropdown();

let table_output = document.querySelector("#output-table");
let ind_output = document.querySelector("#output");

let result = null;
let nicer_data = null;

function getGameData() {
  let game_chosen = document.querySelector("#game-select").value;
  console.log("filtering to " + game_chosen);

  let params = {
    method: "POST",
    headers: { "Content-type": "application/json" },
  };
  params["body"] = JSON.stringify({}); // !
  fetch(games_url, params).then(function (response) {
    response.text().then(function (text) {
      game_res = JSON.parse(text).filter(
        (pt) => pt.game_string === game_chosen
      )[0];

      let dat_params = {
        method: "POST",
        headers: { "Content-type": "application/json" },
      };
      dat_params["body"] = JSON.stringify({}); // !
      fetch(data_url, dat_params).then(function (response) {
        response.text().then(function (text) {
          data_res = JSON.parse(text).filter(
            (pt) => pt.game_string === game_chosen
          );

          let gm_params = {
            method: "POST",
            headers: { "Content-type": "application/json" },
          };
          let gm_uurl = `http://165.106.10.170:${port}/gms`;
          gm_params["body"] = JSON.stringify({}); // !
          fetch(gm_uurl, gm_params).then(function (response) {
            response.text().then(function (text) {
              gm_res = JSON.parse(text).filter(
                (p) => p.game_string === game_chosen
              );

              parseGameData(game_res, data_res, gm_res);
            });
          });
        });
      });
    });
  });
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

  document.querySelector("#game-name").innerHTML = title_string;

  let game_info_string = `<ul> 
      <li>GM(s): <strong>${gm_info.map((d) => d.player_name)}</strong></li> 
      <li><strong>${data_info.length}</strong> players</li> 
      <li><strong>${game_info.num_cycles}</strong> cycles</li> 
      <li><strong>${game_info.num_posts}</strong> posts</li> 
      <li>Setting: ${game_info.setting} </li> 
      <li> Complexity: ${game_info.complexity}</li> 
      <li> Fundamentals: ${game_info.fundamentals}</li> 
      </ul>`;

  document.querySelector("#game-info").innerHTML = game_info_string;

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
  table_output.innerHTML = makeTable(nicer_data);
}
