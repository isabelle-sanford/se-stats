


function fillPlayerDropdown() {
    let dropdown = document.querySelector("#player-select");

    let params = {
        method: "POST",
        headers: { "Content-type": "application/json" },
    };
    let uurl = `http://165.106.10.170:${port}/players`;
    params["body"] = JSON.stringify({}); // pass the param "count" using post
    fetch(uurl, params).then(function (response) {
        response.text().then(function (text) {
            let result = JSON.parse(text);
            console.log(result);

            let opt = ""
            result.forEach(name => {
                opt += "<option value=\"" + name.player_name + "\" >" + name.player_name + "</option>";
            })

            dropdown.innerHTML = opt;
        });
    });
}




// INITIAL SETUP

fillPlayerDropdown();



// queryGames();



let table_output = document.querySelector("#output-table")
let ind_output = document.querySelector("#output")

let result = null
let nicer_data = null








function parsePlayerData(data_info, gm_info) {
    let num_games = data_info.length;
    let n_evil = data_info.filter(p => p.is_elim).length
    let n_won = data_info.filter(p => p.win).length
    let n_survived = data_info.filter(p => p.death_char === "S").length

    let player_info_string = `<ul>
        <li># Games Played: ${num_games}</li>
        <li># Evil: ${n_evil} (${Math.round(n_evil * 1000 / num_games) / 10} %) </li>
        <li># Won: ${n_won} (${Math.round(n_won * 1000 / num_games) / 10}%) </li>
        <li># Survived: ${n_survived} (${Math.round(n_survived * 1000 / num_games) / 10}%) </li>
    </ul>`

    if (gm_info.length > 0) {
        let gm_info_string = `<br># Games GMed: ${gm_info.length}<br>
        List of games: 
        <ul> ${gm_info.map(g => "<li>" + g.game_string + "</li>").join(" ")} </ul>`

        player_info_string += gm_info_string

    }

    document.querySelector("#player-info").innerHTML = player_info_string;

    nicer_data = data_info.map(p => {
        return {
            "Game": p.game_string,
            "Won": p.win ? "Y" : "N",
            "Alignment": p.alignment_char === "E" ? "Evil" : p.alignment_desc,
            "Death": p.death_char === "F" ? "Friendly Fire" : p.death_desc,
            "1st hit": p.first_hit === null ? "-" : p.first_hit,
            "Last hit": p.last_hit === null ? "-" : p.last_hit,
            "# Hits": p.num_hits === null ? "-" : p.num_hits
        }
    })

    table_output.innerHTML = tabform1(nicer_data)


}


function getPlayerData() {
    let player = document.querySelector("#player-select").value;

    let params = {
        method: "POST",
        headers: { "Content-type": "application/json" },
    };

    params["body"] = JSON.stringify({}); // !


    fetch(data_url, params).then(response => {
        response.text().then(text => {
            data_res = JSON.parse(text).filter(p => p.player_name === player)

            document.querySelector("#player-name").innerText = player;

            fetch(gm_url, params).then(response => {
                response.text().then(text => {
                    gm_res = JSON.parse(text).filter(p => p.player_name === player)

                    parsePlayerData(data_res, gm_res)
                })
            })



        })
    })

}




