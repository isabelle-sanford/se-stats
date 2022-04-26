const port = 40967;

//const data_url = `http://165.106.10.170:${port}/data`;
const games_url = `http://165.106.10.170:${port}/gamelist`;
//const gm_url = `http://165.106.10.170:${port}/gms`;
const players_url = `http://165.106.10.170:${port}/players`;

const one_game_page = `http://165.106.10.170:${port}/one_game`;
const one_player_page = `http://165.106.10.170:${port}/one_player`;


let result = null;
let nicer_data = null;

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
        let linky = `${one_game_page}?game-select=${element[k].trim()}+++`;
        tbl += `<td
            class="${k} ${element[k]}"
            onclick='examineGame("${element[k]}")'>
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
