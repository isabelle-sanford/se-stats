
create materialized view gm_list as (
    with hasplayer as (
        select game_id, player_name from gms natural join player
    )

    select game_id, game_string, game_format, player_name from hasplayer natural join game
    
)


CREATE MATERIALIZED VIEW game_view as (

    with incl_IM as (
        select * from game left join player on game.IM_id = player.player_id
    ),

    incl_setting as (
        select * from incl_IM natural join setting
    )

    select game_id, game_format, game_string, anon_num, mechanics_balance, distribution_balance, player_name as IM, num_cycles, setting, is_sanderson, is_cosmere, complexity, fundamentals, num_posts, role_madness, title
        from incl_setting
    
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

