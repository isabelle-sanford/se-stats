const { MongoClient } = require('mongodb');
const uri = "mongodb://127.0.0.1/isanford";
const client = new MongoClient(uri, { useUnifiedTopology: true });
let using_mongo = false;


function parseGameDataMongo(results) {
    let title_string = `<h1 class="bg-primary py-2">
    ${results.game_string}- 
    <u><a class="text-light" 
        href="https://www.17thshard.com/forum/topic/4985-long-game-1-in-the-wake-of-the-koloss/">
        ${results.title}
    </a></u>
    </h1>`;

    let game_info_string = `<ul> 
    <li>GM(s): <strong>${results["GMs"].join(", ")}</strong></li> 
    <li><strong>${results.player_stats.player_list.length}</strong> players</li> 
    <li><strong>${results.num_cycles}</strong> cycles</li> 
    <li><strong>${results.num_posts}</strong> posts</li> 
    <li>Setting: ${results.setting.world} </li> 
    <li> Complexity: ${results.basics.complexity}</li> 
    <li> Fundamentals: ${results.basics.fundamentals}</li> 
    <li> Winner: ${results.winner}</li> 
    </ul>`;

    let nicer_data = {
        "Name": results.player_stats.player_list
    }

    let table_string = makeTable(nicer_data)

    return {
        title: title_string,
        info: game_info_string,
        table: table_string
    }

}

async function singleGameMongo(game, client) {
    let query = { game_string: game }

    let results = await client.db().collection('players').findOne(query);

    return results;
}

async function getMongoGame(game) {
    try {

        console.log("connecting to mongo")
        await client.connect();

        console.log("connected!")
        await singleGameMongo(game, client)

    } catch (e) {
        console.error(e);
    } finally {

        console.log("connection closed")
        await client.close();

    }
}



async function doQueryA(client) {
    let spec = { player_name: "Elbereth" }
    let results = await client.db().collection('players').findOne(spec);

    console.log(`QA ${results['games'][0]['game_string']} ${results['games'][0]['alignment']}`);

    console.log(results);
}
testMongo()