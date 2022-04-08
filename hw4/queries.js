// Index creation (done on command line)
db.games.createIndex({ format: 1 });
db.players.createIndex({ "games.game_string": 1 });

// Q1: What games have I played?

db.players.findOne(
  { player_name: "Elbereth" },
  { "games.game_string": 1, _id: 0 }
);

// Q2: What % of the time does the evil team win?
// note "winner" is inaccurate and overcounting faction games etc

db.games.find({ winner: "E" }).count() / db.games.count();

// Q3: Does who wins correlate to game length?

db.games.aggregate([
  {
    $group: {
      _id: "$winner",
      avgCycles: {
        $avg: "$num_cycles",
      },
    },
  },
]);
