/**
 * Adapted from example in multiple sites on web
 */

const path = require("path");
const url = require("url");
const express = require("express");
const app = express();
const port = 30025;

app.use("/", express.static(path.join(__dirname)));

app.get("/getit", function (request, response) {
  console.log("Get gotten");
  let url_parts = url.parse(request.url, true);
  let query = url_parts.query;
  console.log(query["count"]);
  response.write("<html><body>");
  response.write(`Hello ${query["count"]}`);
  response.end("</body ></html>");
});

app.listen(port, function (error) {
  if (error) throw error;
  console.log("Server created Successfully");
});
