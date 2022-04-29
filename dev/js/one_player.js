function fillPlayerDropdown() {
  let dropdown = document.querySelector("#player");
  let selected = document.querySelector("#sel")
  console.log(selected)

  let params = {
    method: "POST",
    headers: { "Content-type": "application/json" },
  };
  params["body"] = JSON.stringify({}); // pass the param "count" using post
  fetch(players_url, params).then(function (response) {
    response.text().then(function (text) {
      let result = JSON.parse(text);
      console.log(result);

      let opt = "";
      let thename = "";
      if (selected !== null) {
        thename = selected.value
        console.log("game: " + thename)
      }
      result.forEach((name) => {
        if (name.player_name === thename) {
          opt += `<option value="${name.player_name}" selected> ${name.player_name} </option> `;
        } else {
          opt += `<option value="${name.player_name}"> ${name.player_name} </option> `;
        }

      });

      dropdown.innerHTML = opt;
    });
  });
}

fillPlayerDropdown();
