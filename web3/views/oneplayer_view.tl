<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

  <title>SE Statistics</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6" crossorigin="anonymous" />
  <link rel="stylesheet" href="./style.css" />
  <script src="../sorttable.js"></script>
</head>

<body>
  <!-- NAVBAR -->
  <nav class="navbar navbar-dark bg-primary navbar-expand-lg flex-md-nowrap shadow p-0 m-0">
    <div class="container-fluid my-0 py-0">
      <a class="navbar-brand" href="index.html">Sanderson Elimination Statistics</a>

      <div class="collapse navbar-collapse" id="navbarToggle">
        <div class="navbar-nav">
          <a class="nav-link active" href="index.html">Full Data</a>
          <a class="nav-link" href="one_game">Find a Game</a>
          <a class="nav-link" href="one_player">Find a Player</a>
        </div>
      </div>
      <a class="nav-link" href="#">Switch to Mongo</a>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggle"
        aria-controls="navbarToggle" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>
  </nav>

  <div class="container jumbotron">
    <form method="get" action="one_player">
      <div class="row">
        <div class="col-3">
          <select class="form-select" aria-label="Default select example" id="player" name="player">
            <option id="sel" selected>${d.selected_player}</option>
          </select>
        </div>

        <div class="col">
          <button type="submit" class="btn btn-primary mb-3">Submit</button>
        </div>
      </div>
    </form>
  </div>

  <div class="container">
    <div class="row" id="output">
      <div class="col-12" id="player-name">
        ${d.title}
        <br />
      </div>

      <div class="col-3 col-xs-6 justify-content-top" id="player-info">
        ${d.info}
      </div>

      <div class="col-9 col-xs-12" id="output-table">${d.table}</div>
    </div>
    <br />
  </div>

  <!-- FOOTER -->
  <footer class="footer">
    <span class="bottom">Isabelle Sanford |</span>
    <a class="footer-data text-dark"
      href="https://docs.google.com/spreadsheets/d/1CxrgdT4Xd8J0N3CuVmkVRryMeIdm93H8rzv8-YlP0kw" title="Original Data"
      target="_blank"><i class="fa fa-fw fa-2x fa-cloud-download"></i><span>Original Data (Stats Sheet)</span></a>
    <!-- target="_blank" opens data page in new tab >>> remove if we keep href as data.html -->
  </footer>

  <!-- SCRIPTS -->
  <!-- bootstrap -->
  <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
    integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
    crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-JEW9xMcG8R+pH31jmWH6WWP0WintQrMb4s7ZOdauHnUtxwoG2vI5DkLtS3qm9Ekf"
    crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.5.0/d3.js"></script>

  <!-- plotly -->
  <!-- <script src="https://cdn.plot.ly/plotly-latest.min.js"></script> -->

  <!-- MINE -->
  <script type="text/javascript" src="js/init_utils.js"></script>
  <script type="text/javascript" src="js/one_player.js"></script>
  <script type="text/javascript" src="js/end_utils.js"></script>
</body>

</html>