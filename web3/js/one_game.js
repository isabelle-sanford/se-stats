function fillGameDropdown() {
    let dropdown = document.querySelector("#game");
    let selected = document.querySelector("#sel")
    console.log(selected)

    let params = {
        method: "POST",
        headers: { "Content-type": "application/json" },
    };
    params["body"] = JSON.stringify({});
    fetch(games_url, params).then(function (response) {
        response.text().then(function (text) {
            let result = JSON.parse(text);
            console.log(result);

            let opt = "";
            let thegame = "";
            if (selected !== null) {
                thegame = selected.value
                console.log("game: " + thegame)
            } else { console.log("selected is null!") }
            result.forEach((game) => {
                // might need to trim? 
                if (game.game_string === thegame) {
                    opt += `<option value="${game.game_string}" selected> ${game.game_string} </option> `;
                } else {
                    opt += `<option value="${game.game_string}"> ${game.game_string} </option> `;
                }

            });


            dropdown.innerHTML = opt;
        });
    });
}

fillGameDropdown();

let table_output = document.querySelector("#output-table");
let ind_output = document.querySelector("#output");
