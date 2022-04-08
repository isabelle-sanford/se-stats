// Q1: What games have I played?

db.players.findOne(
  { player_name: "Elbereth" },
  { "games.game_string": 1, _id: 0 }
);

// Q2: Game lengths by outcome
// Different from SQL data because pulling from 'winner'
// which only allows for one winner per game
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
