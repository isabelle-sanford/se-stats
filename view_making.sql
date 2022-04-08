

-- todo: make a view that's more like data test, game test, etc 
-- probably want it to actually be create MATERIALIZED view

CREATE OR REPLACE MATERIALIZED VIEW game_view (

    select game_string, is_anon, broken, start_date, end_date, num_cycles, is_sanderson, world, complexity, fundamentals, num_posts
        from game
    
    -- get IM from player_id

    -- get GMs from gms table


    -- count num survivors, list winner(s) from playergame

)

-- might need to be create or replace game_view(columns) as select_query


CREATE OR REPLACE MATERIALIZED VIEW player_view (

    -- want: player name, num played, num GMed, num/% evil, first game

)





-- returns avg number & percent of surviving elims in games where elims won

-- pulls out rows of elims who won 
with winning_elim_results as (
    select game_id, death_id, count(player_id) as n_elims 
        from playergame as pg 
        where pg.win and
        pg.alignment_id in ( select alignment_id from alignment where is_elim)
        group by game_id, death_id
        order by game_id
),

win_elim_death_per_game as (
    select game_id, n_tot, alive_elims, dead_elims, alive_elims / n_tot as perc_alive 
        from (
            select game_id, n_elims as alive_elims 
                from winning_elim_results
                where death_id = 0
        ) as wes
        natural join
        (
            select game_id, sum(n_elims) as dead_elims 
                from winning_elim_results
                where death_id > 0
                group by game_id
        ) as wed
        natural join 
        (
            select game_id, sum(n_elims) as n_tot 
                from winning_elim_results
                group by game_id
        ) as wen
)

select 
    avg(n_tot) as avg_num, 
    avg(alive_elims) as avg_alive,
    avg(dead_elims) as avg_dead,
    avg(perc_alive) as avg_perc_alive
from win_elim_death_per_game;


