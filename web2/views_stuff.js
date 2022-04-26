// NOT DOING ANYTHING

export function parseGameData(opts) {
  let game_info = opts["game_info"];
  let data_info = opts["data_info"];
  let gm_info = opts["gm_info"];
  // TODO: actual wanted link
  let title_string = `<h1 class="bg-primary py-2">
            ${game_info.game_string}- 
            <u><a class="text-light" 
                href="https://www.17thshard.com/forum/topic/4985-long-game-1-in-the-wake-of-the-koloss/">
                ${game_info.title}
            </a></u>
            </h1>`;

  //document.querySelector("#game-name").innerHTML = title_string;

  let game_info_string = `<ul> 
        <li>GM(s): <strong>${gm_info.map((d) => d.player_name)}</strong></li> 
        <li><strong>${data_info.length}</strong> players</li> 
        <li><strong>${game_info.num_cycles}</strong> cycles</li> 
        <li><strong>${game_info.num_posts}</strong> posts</li> 
        <li>Setting: ${game_info.setting} </li> 
        <li> Complexity: ${game_info.complexity}</li> 
        <li> Fundamentals: ${game_info.fundamentals}</li> 
        </ul>`;

  //document.querySelector("#game-info").innerHTML = game_info_string;

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
