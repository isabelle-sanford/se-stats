Isabelle Sanford
Homework 5, 4/28/2022
CS383: Databases in Practice 

URL to access website: http://165.106.10.170:40967/ 


Files
=====
    table_making.sql
        Similar but not quite identical to the one from HW4; there's a couple attributes that still aren't filled out and a couple I added in (e.g. 'winner' which is technically redundant information but really annoying to get via joins.). The data hasn't changed (or not materially; I slightly altered a few descriptions to be clearer.)

    view_making.sql 
        It's much easier to pull from a couple materialized view than try to do the same joins every time I query the database. They're pretty similar to my original data source. 

    server.js
        File that starts the node server and does all the other stuff. 

    sorttable.js
        File that provides easy client-side table sorting. Mentioned by Trang (I think) in class, taken from here: https://www.kryogenix.org/code/browser/sorttable/
    

js/ directory
    init_utils.js
        Just a list of constants used in one_game and one_player.js. 
    one_game.js, one_player.js 
        JS files that contain functions for filling in the values for the game and player dropdowns, respectively (on the one_game and one_player pages). 

views/ directory 
    index.tl, indexM.tl 
        Template html files which represent the main page of the site. (M is for Mongo; they're nearly identical pages and should really just be one file with a couple more templating bits for database, but since I don't intend to keep using both databases long term I didn't bother.) The only actual notable templating is just a place to insert the table down below when it's queried. 
    
    onegame_view.tl, onegame_viewM.tl, oneplayer_view.tl, oneplayer_viewM.tl
        HTML template files for the one_game and one_player pages, respectively. Each have 3 points where templating is relevant - the title (game / player name), an info box on the left-hand side of the page, and a place for the main table to go.  
    
    oneplayer_view.tl, oneplayer_viewM.tl
        HTML template files for the one_player page. 

I've deleted the node-related files (node_modules/, package and package-lock.json, nohup.out) before submitting this. 


Restarting: 
In my public_html/se-stats/hw5 directory, run 
    nohup node server.js &


Notes and comments: 
- The 'data' tab on the main page only queries from postgres, not mongo (as will be fairly clear if you try). It'd be theoretically possible to do in Mongo, but the structure of the collections is such that there would be a fair amount of joining involved that wasn't worth wrangling. 

- In general, the queries for each database are the same but they may return slightly different results (most notably that the one_game tab will only show a list of player names in Mongo, while SQL will provide details on what happened to each player as well). My choices for what to put in each database were slightly different, which in general means that Mongo has more summary data (e.g. you'll notice the games tab on the main page provides number of players in mongo but not postgres) and more somewhat-patchy data (the single player page lists roles in mongo, but that data is messy and incomplete enough that I haven't even tried loading it into SQL yet), but is less cross-referential between games and players than SQL can be. 

- Mongo's data is also not cross-referenced with my SQL tables which provide clearer descriptions for several categories, so "Good" in SQL might be marked as just "G" in Mongo. 

- The github code for this is here: https://github.com/isabelle-sanford/se-stats Everything submitted in this homework is (surprise) in the hw5/ folder, and - as I mentioned - probably won't change unless I find something egregious. (But I am treating this port as my "production" site in that I'll also be showing it to my community, so I don't promise no changes at all.) If I do change anything, it will be listed at the top of this readme and the repository's general readme. 

- There are a few games inexplicably missing from the SQL table; this means that on occasion clicking on a link to a game page (via a player page or the main data tab) will lead to the blank one_game page in SQL. (In Mongo, those games still won't show up in the dropdown - which is pulled from SQL either way - but will actually show the data if you get there via a link.)

- I intend to probably use only SQL going forward (though Mongo would arguably be wiser), which is why I spent less time/effort there. 

- I am aware that certain things don't persist through querying (like checkbox state or which tab you're on) and that it's very annoying. I would be sorry if I thought it would annoy you more than it's annoying me. 

- I'd say have a good summer, but it's not like I'll be gone. So good luck grading everything! 

