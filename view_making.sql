

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