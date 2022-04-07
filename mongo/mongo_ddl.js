// Q1: What games have I played?

db.players.findOne(
  { player_name: "Elbereth" },
  { "games.game_string": 1, _id: 0 }
);

// Q2:

db.games.aggregate([
  {
    $group: {
      _id: "$winner",
      avgCycles: {
        $avg: {
          $toInt: "$num_cycles",
        },
      },
    },
  },
]);

db.games.aggregate([
  {
    $group: {
      _id: "$winner",
      avgCycles: {
        $toInt: "$num_cycles",
      },
    },
  },
]);

db.games.aggregate([
  { $addFields: { intCycles: { $toInt: "$num_cycles" } } },
  { $project: { winner: 1, intCycles: 1, game_string: 1 } },
]);

winsAndNums = {
  $addFields: {
    intCycles: { $toInt: "$num_cycles" },
  },
};
db.games.find({ game_num: "8" }, { test: { $toInt: "$num_cycles" } });
