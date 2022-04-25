/**
 * Very simple site for serving static pages
 * and performing one simple query on the rocket database
 *
 * To start: UNIX> nohup node app6.js &
 *           where apps6.js is the name of this file
 *           nohup allows things to run in background, smoothly
 */

const path = require("path");
const express = require("express");
const { Pool } = require("pg"); // connecting to postgres
const {
    CommandCompleteMessage,
    closeComplete,
} = require("pg-protocol/dist/messages");

// Connection to postgres parameters
const pool = new Pool({
    user: "dbuser",
    host: "localhost",
    database: "isanford",
    password: "12345678",
    port: 5432,
});

console.log("Created pool ", pool);

const app = express();
const port = 40967; // 40969,  stuck??

// static pages are served from the same directory as this file
app.use("/", express.static(path.join(__dirname)));

function init_dbreq(dberr, client, done, req, res) {
    if (dberr) {
        res.writeHead(500);
        res.end(
            "Sorry, check with the site admin for error: " + dberr.code + " ..\n"
        );
        return;
    }

    client.query("SELECT * from data_view;", function (dberr, dbres) {
        done();
        if (dberr) {
            res.writeHead(500);
            res.end(
                "Sorry, check with the site admin for error: " + dberr.code + " ..\n"
            );
        } else {
            res.json(dbres.rows);
        }
    });
}

function init_players(dberr, client, done, req, res) {
    if (dberr) {
        res.writeHead(500);
        res.end(
            "Sorry, check with the site admin for error: " + dberr.code + " ..\n"
        );
        return;
    }

    client.query("SELECT player_name from player", function (dberr, dbres) {
        done();
        if (dberr) {
            res.writeHead(500);
            res.end(
                "Sorry, check with the site admin for error: " + dberr.code + " ..\n"
            );
        } else {
            res.json(dbres.rows);
        }
    });
}

function init_gamedata(dberr, client, done, req, res) {
    if (dberr) {
        res.writeHead(500);
        res.end(
            "Sorry, check with the site admin for error: " + dberr.code + " ..\n"
        );
        return;
    }

    client.query("SELECT * from game_view;", function (dberr, dbres) {
        done();
        if (dberr) {
            res.writeHead(500);
            res.end(
                "Sorry, check with the site admin for error: " + dberr.code + " ..\n"
            );
        } else {
            res.json(dbres.rows);
        }
    });
}

function init_gms(dberr, client, done, req, res) {
    if (dberr) {
        res.writeHead(500);
        res.end(
            "Sorry, check with the site admin for error: " + dberr.code + " ..\n"
        );
        return;
    }

    client.query("SELECT * from gm_list;", function (dberr, dbres) {
        done();
        if (dberr) {
            res.writeHead(500);
            res.end(
                "Sorry, check with the site admin for error: " + dberr.code + " ..\n"
            );
        } else {
            res.json(dbres.rows);
        }
    });
}

app.post("/data", express.json({ type: "*/*" }), function (req, res) {
    pool.connect(function (dberr, client, done) {
        init_dbreq(dberr, client, done, req, res);
        console.log("data loaded, in theory");
    });
});

app.post("/games", express.json({ type: "*/*" }), function (req, res) {
    pool.connect(function (dberr, client, done) {
        init_gamedata(dberr, client, done, req, res);
        console.log("game data loaded, in theory");
    });
});

app.post("/players", express.json({ type: "*/*" }), function (req, res) {
    pool.connect(function (dberr, client, done) {
        init_players(dberr, client, done, req, res);
    });
});

app.post("/gms", express.json({ type: "*/*" }), function (req, res) {
    pool.connect(function (dberr, client, done) {
        init_gms(dberr, client, done, req, res);
    });
});







// start the Node server
app.listen(port, function (error) {
    if (error) throw error;
    console.log(`Server created Successfully on port ${port}`);
});
