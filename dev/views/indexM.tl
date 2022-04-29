<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

    <title>SE Statistics</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6" crossorigin="anonymous" />
    <link rel="stylesheet" href="./style.css" />

    <meta name="description" content="Statistics for Sanderson Elimination" />
    <script src="../sorttable.js"></script>
</head>

<body>
    <!-- NAVBAR -->
    <nav class="navbar navbar-dark bg-success navbar-expand-lg flex-md-nowrap shadow p-0 m-0">
        <div class="container-fluid my-0 py-0">
            <a class="navbar-brand" href="indexM">Sanderson Elimination Statistics</a>

            <div class="collapse navbar-collapse" id="navbarToggle">
                <div class="navbar-nav">
                    <a class="nav-link active" href="indexM">Full Data</a>
                    <a class="nav-link" href="one_gameM">Find a Game</a>
                    <a class="nav-link" href="one_playerM">Find a Player</a>
                </div>
            </div>
            <a class="nav-link" href="/">Switch to Postgres</a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggle"
                aria-controls="navbarToggle" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
        </div>
    </nav>

    <!-- FORMS -->
    <div class="container jumbotron">
        <nav>
            <div class="nav nav-tabs bg-success border border-success border-5 border-bottom-0" id="nav-tab"
                role="tablist">
                <!-- todo: make correct one show active -->
                <button class="nav-link" id="nav-player-tab" data-bs-toggle="tab" data-bs-target="#nav-player"
                    type="button" role="tab" aria-controls="nav-player" aria-selected="${d.on_data_tab}">
                    Data
                </button>
                <button class="nav-link active" id="nav-game-tab" data-bs-toggle="tab" data-bs-target="#nav-game"
                    type="button" role="tab" aria-controls="nav-game" aria-selected="${d.on_game_tab}">
                    Games
                </button>
            </div>
        </nav>
        <div class="tab-content px-5 border border-success border-top-0 border-5" id="nav-tabContent">
            <!-- general data -->
            <!-- show active thingy!! -->
            <div class="tab-pane" id="nav-player" role="tabpanel" aria-labelledby="nav-player-tab">
                (still using postgres)
                <form method="post" action="index" id="get-data">
                    <input type="hidden" name="tab" value="on-data-tab">
                    <div class="row">
                        <div class="col-auto">
                            <br />
                            <h3>Format</h3>
                            <div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" value="" id="LGcheck" name="LGcheck"
                                        checked />
                                    <label class="form-check-label" for="LGcheck">
                                        Long Game
                                    </label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" value="" id="MRcheck" name="MRcheck"
                                        checked />
                                    <label class="form-check-label" for="MRcheck">
                                        Mid Range
                                    </label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" value="" id="QFcheck" name="QFcheck"
                                        checked />
                                    <label class="form-check-label" for="QFcheck">
                                        Quick Fix
                                    </label>
                                </div>
                                <br />
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" value="" id="AGcheck" name="AGcheck"
                                        checked />
                                    <label class="form-check-label" for="AGcheck">
                                        Anniversary Game
                                    </label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" value="" id="BTcheck" name="BTcheck"
                                        checked />
                                    <label class="form-check-label" for="BTcheck">
                                        Break Tank
                                    </label>
                                </div>
                            </div>

                            <br /><br />
                            <h3>Win</h3>
                            <div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" value="" id="WinCheck"
                                        name="WinCheck" checked />
                                    <label class="form-check-label" for="WinCheck"> Won </label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" value="" id="LoseCheck"
                                        name="LoseCheck" checked />
                                    <label class="form-check-label" for="LoseCheck">
                                        Lost
                                    </label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" value="" id="DrawCheck"
                                        name="DrawCheck" checked />
                                    <label class="form-check-label" for="DrawCheck">
                                        Drew
                                    </label>
                                </div>
                            </div>

                            <br /><br />
                            <h3>Alignments</h3>
                            <div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" value="" id="VillageCheckD"
                                        name="VillageCheckD" checked />
                                    <label class="form-check-label" for="VillageCheckD">
                                        Village
                                    </label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" value="" id="ElimCheckD"
                                        name="ElimCheckD" checked />
                                    <label class="form-check-label" for="ElimCheckD">
                                        Elim
                                    </label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" value="" id="FactionCheckD"
                                        name="FactionCheckD" checked />
                                    <label class="form-check-label" for="FactionCheckD">
                                        Faction
                                    </label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" value="" id="NeutralCheckD"
                                        name="NeutralCheckD" checked />
                                    <label class="form-check-label" for="NeutralCheckD">
                                        Neutral
                                    </label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" value="" id="OtherAlignmentCheckD"
                                        name="OtherAlignmentCheckD" checked />
                                    <label class="form-check-label" for="OtherAlignmentCheckD">
                                        Other
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="col-auto">
                            <br />
                            <h3>Death</h3>
                            <div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="SurviveCheck"
                                        name="SurviveCheck" checked />
                                    <label class="form-check-label" for="SurviveCheck">
                                        Survived (S)
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="EKillCheck"
                                        name="EKillCheck" checked />
                                    <label class="form-check-label" for="EKillCheck">
                                        Killed by Evil (E, M)
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="ExeCheck"
                                        name="ExeCheck" checked />
                                    <label class="form-check-label" for="ExeCheck">
                                        Executed (X)
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="VigCheck"
                                        name="VigCheck" checked />
                                    <label class="form-check-label" for="VigCheck">
                                        Vigilante (V, F)
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="NeutralDeathCheck"
                                        name="NeutralDeathCheck" checked />
                                    <label class="form-check-label" for="NeutralDeathCheck">
                                        Killed by Neutral (N)
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="OtherDeathCheck"
                                        name="OtherDeathCheck" checked />
                                    <label class="form-check-label" for="OtherDeathCheck">
                                        Other (I, O, D, P)
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />

                    <div class="row d-grid gap-2">
                        <button type="submit" class="btn btn-success">
                            Submit
                        </button>
                    </div>


                </form>
                <br />


                <br />
            </div>

            <!-- games -->
            <div class="tab-pane show active" id="nav-game" role="tabpanel" aria-labelledby="nav-game-tab">
                <br />
                <form method="post" action="indexM">
                    <input type="hidden" name="tab" value="on-game-tab">
                    <div class="row">
                        <div class="col-auto">
                            <h3>Format</h3>
                            <div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="LGcheckG"
                                        name="LGcheckG" checked />
                                    <label class="form-check-label" for="LGcheckG">
                                        Long Game
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="MRcheckG"
                                        name="MRcheckG" checked />
                                    <label class="form-check-label" for="MRcheckG">
                                        Mid Range
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="QFcheckG"
                                        name="QFcheckG" checked />
                                    <label class="form-check-label" for="QFcheckG">
                                        Quick Fix
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="AGcheckG"
                                        name="AGcheckG" checked />
                                    <label class="form-check-label" for="AGcheckG">
                                        Anniversary Game
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="BTcheckG"
                                        name="BTcheckG" checked />
                                    <label class="form-check-label" for="BTcheckG">
                                        Break Tank
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="col-auto">
                            <h3>Winner</h3>
                            <div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="VillageWinCheck"
                                        name="VillageWinCheck" checked />
                                    <label class="form-check-label" for="VillageWinCheck">
                                        Village
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="ElimWinCheck"
                                        name="ElimWinCheck" checked />
                                    <label class="form-check-label" for="ElimWinCheck">
                                        Eliminators
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="FactionWinCheck"
                                        name="FactionWinCheck" checked />
                                    <label class="form-check-label" for="FactionWinCheck">
                                        Faction
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="NeutralWinCheck"
                                        name="NeutralWinCheck" checked />
                                    <label class="form-check-label" for="NeutralWinCheck">
                                        Neutral
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="OtherWinCheck"
                                        name="OtherWinCheck" checked />
                                    <label class="form-check-label" for="OtherWinCheck">
                                        Other
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />

                    <div class="row d-grid gap-2">
                        <button type="submit" class="btn btn-success">
                            Submit
                        </button>
                    </div>
                </form>
                <br />
            </div>
        </div>
    </div>

    <!-- Output -->
    <div class="container">
        <div class="row" id="output-stats"></div>

        <div class="row justify-content-center align-items-center" id="output-table">${d.table}</div>
    </div>

    <!-- FOOTER -->
    <footer class="footer">
        <span class="bottom">Isabelle Sanford |</span>
        <a class="footer-data text-dark"
            href="https://docs.google.com/spreadsheets/d/1CxrgdT4Xd8J0N3CuVmkVRryMeIdm93H8rzv8-YlP0kw"
            title="Original Data" target="_blank"><i class="fa fa-fw fa-2x fa-cloud-download"></i><span>Original Data
                (Stats Sheet)</span></a>
        <!-- where the FUCK did the <i> come from -->
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
</body>

</html>