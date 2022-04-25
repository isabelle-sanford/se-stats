const port = 40967

const data_url = `http://165.106.10.170:${port}/data`;
const games_url = `http://165.106.10.170:${port}/games`;
const gm_url = `http://165.106.10.170:${port}/gms`;

/**
 * Create an html table from a bunch of data in JSON form.
 * Where the JSON form is an array of objects
 * @param dbres -- the JSON data
 * @returns an HTML table
 */
function tabform1(dbres) {
    let tbl = '<table class="table table-striped table-sm">';
    let dbkeys = Object.keys(dbres[0]);
    tbl += "<thead><tr>";
    // first, format the table header.
    // each item in the header is a key in the first JSON object
    // each of these is turned into a button that sorts the JSON data on that key
    dbkeys.forEach((k) => {
        tbl += `<th><button type="button" class="btn btn-outline-secondary" onclick='doReSort("${k}")'>${k} </button></th>`
    });

    tbl += "</tr></thead><tbody>";
    dbres.forEach((element) => {
        //console.log(element);
        tbl += "<tr>";
        dbkeys.forEach((k) => {
            //console.log(k, element[k]);

            tbl += "<td class=\"" + k + element[k] + "\">" + element[k] + "</td>";
        });
        tbl += "</tr>";
    });
    tbl += "</tbody></table>";
    return tbl;
}