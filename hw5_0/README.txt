Isabelle Sanford
Homework 5
CS383: Databases in Practice 

URL to access website: http://165.106.10.170:40967/ 



Files: 
    table_making.sql
        Similar but not quite identical to the one from HW4; there's a couple attributes that still aren't filled out and a couple I added in (e.g. 'winner' which is technically redundant information but really annoying to get via joins.). The data hasn't changed (or not materially; I slightly altered a few descriptions to be clearer.)

    view_making.sql 
        It's much easier to pull from a couple materialized view than try to do the same joins every time I query the database. Very similar to original data

    server.js
        File that starts the node server and does all the other stuff. 

    sorttable.js
        File that provides easy client-side table sorting. [cite]

        html whatevers
        css


Restarting: 
In my public_html/se3/ directory, run 
    nohup node server.js &




