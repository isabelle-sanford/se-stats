
Name: Isabelle Sanford
Assignment: HW4, CS383 (Databases)

FILE LIST
=========
Comments are present to varying degrees, with varying amounts of intelligibility. I'll almost definitely have changed some more things before you see this; I'm keeping a github repo here (https://github.com/isabelle-sanford/se-stats) for my own sanity. 

table_making.sql  
    DDL SQL file making all tables & indices 

data_cleaning.ipynb 
    Jupyter notebook taking my data from the original CSVs from the google sheet and putting it into SQL. Divided into three parts: basic cleaning (duplicated in mongo_making.ipynb / should probably be taken out), transformation into the appropriate tables (approximately equivalent to the CSVs submitted for hw3), and actual insertion. Fairly long, but the actual insertion part is pretty short - it just took a lot of cleaning to get there.

queries.sql 
    SQL queries.

mongo_making.ipynb 
    Jupyter notebook taking my data from the original CSVs from the google sheet and putting it into mongo. Divided into three parts: basic cleaning as before, making dicts in python, and insertion into mongo. 

queries.js 
    Mongo queries. Also the lines I used to create the mongo indices. 

report.pdf 
    Part 1, diagrams and descriptions of the table/collection structures and why they're like that. (I promise it's only 2.5 pages if you take out the diagrams and examples.) Also part 2, query descriptions. 



    







