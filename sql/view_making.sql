
create materialized view gm_list as (
    with hasplayer as (
        select game_id, player_name from gms natural join player
    )

    select game_id, game_string, game_format, player_name from hasplayer natural join game
    
)


-- todo: make a view that's more like data test, game test, etc 
-- probably want it to actually be create MATERIALIZED view

CREATE MATERIALIZED VIEW game_view as (

    with incl_IM as (
        select * from game left join player on game.IM_id = player.player_id
    ),

    incl_setting as (
        select * from incl_IM natural join setting
    )

    -- summaries as (
    --     select game_id, count(player_id)
    --     from playergame as pg 
    --     where alignment_id
    --     group by game_id
    -- )

    select game_id, game_format, game_string, anon_num, mechanics_balance, distribution_balance, player_name as IM, num_cycles, setting, is_sanderson, is_cosmere, complexity, fundamentals, num_posts, role_madness, title
        from incl_setting
    

    -- count num survivors, list winner(s) from playergame

);

-- might need to be create or replace game_view(columns) as select_query


CREATE OR REPLACE MATERIALIZED VIEW player_view (

    -- want: player name, num played, num GMed, num/% evil, first game




);

CREATE MATERIALIZED VIEW data_view AS (
    -- 
    WITH pg_players AS (
        SELECT * from playergame natural join player
    ), 

    pg_games AS (
        SELECT pg.*, game.game_format, game.game_string
        FROM pg_players as pg natural join game
     ), 
    
    pg_align AS (
        SELECT pg.*, alignment.alignment_char, alignment.is_elim, alignment.was_converted, alignment.alignment_desc
        FROM pg_games as pg natural join alignment
    ),

    pg_death AS (
        SELECT * from pg_align natural join death
    )

    select player_id, player_name, game_id, game_format, game_string, alignment_char, is_elim, was_converted, alignment_desc,  death_char, death_desc, first_hit, last_hit, num_hits, win, inactive
    from pg_death

);



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


