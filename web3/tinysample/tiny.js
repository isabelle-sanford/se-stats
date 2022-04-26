const express = require('express'),
    app = express(),
    tl = require('express-tl')

const port = 40967;
const path = require("path");


app.engine('tl', tl)
app.set('views', '.') // specify the views directory
app.set('view engine', 'tl') // register the template engine

app.use("/", express.static(path.join(__dirname)));


app.get('/one_game', function (req, res) {
    res.render('tiny', {
        eat: ['apple', 'orange', 'carot'],
        sport: true
    })
})

app.listen(port, function (error) {
    if (error) throw error;
    console.log(`Server created Successfully on port ${port}`);
});
