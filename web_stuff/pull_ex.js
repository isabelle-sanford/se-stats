/**
 * Create an html table from a bunch of data in JSON form.
 * Where the JSON form is an array of objects
 * @param dbres -- the JSON data
 * @returns an HTML table
 */
function tabform1(dbres) {
  let tbl = '<table border="1">';
  let dbkeys = Object.keys(dbres[0]);
  tbl += "<tr>";
  // first, format the table header.
  // each item in the header is a key in the first JSON object
  // each of these is turned into a button that sorts the JSON data on that key
  dbkeys.forEach((k) => {
    tbl +=
      "<th><button onclick='doReSort(\"" + k + "\")'>" + k + "</button></th>";
  });

  tbl += "</tr>";
  dbres.forEach((element) => {
    console.log(element);
    tbl += "<tr>";
    dbkeys.forEach((k) => {
      //console.log(k, element[k]);
      tbl += "<td>" + element[k] + "</td>";
    });
    tbl += "</tr>";
  });
  tbl += "</table>";
  return tbl;
}

// A global variable to get and hold the data resulting from a query
let qResult = null;
let qCount = 4;

/**
 * Do a query.  This just calls a fairly static query on the rocket database.
 * Each time it is called, it gets one more random rocket than the previous time
 */
function doQuery() {
  let params = {
    method: "POST",
    headers: { "Content-type": "application/json" },
  };
  let uurl = "http://165.106.10.170:40969/games";
  params["body"] = JSON.stringify({ count: qCount }); // pass the param "count" using post
  fetch(uurl, params).then(function (response) {
    response.text().then(function (text) {
      qResult = JSON.parse(text);
      console.log(qResult);
      document.querySelector("#gt").innerHTML = text;
      document.querySelector("#gt2").innerHTML = tabform1(qResult);
    });
  });
  qCount = qCount + 1;
}

/**
 * Sort the retrieved data by the given key.
 * Then reformat it into a table.
 * @param {} field the field on which to sort.
 */
function doReSort(field) {
  sortBy(field);
  document.querySelector("#gt2").innerHTML = tabform1(qResult);
}

// ! nearly sure there's a better option here...
/**
 * Actually do the Sorting
 * @param {} pName the field by which to sort
 */
function sortBy(pName) {
  function compare(a, b) {
    if (a[pName] < b[pName]) {
      return -1;
    }
    if (a[pName] > b[pName]) {
      return 1;
    }
    return 0;
  }
  qResult.sort(compare);
  console.log(`sorted on ${pName}`);
  //console.log(qResult);
}
