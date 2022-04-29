

-- returns a list of all the games I've played----------
with my_games as (
select game_id from playergame 
    where playergame.player_id IN (select player_id from player where player_name LIKE 'Elbereth')
)

select game_string from game natural join my_games;


-- How often does the evil team win? 

with e_games as (
    select win, count(distinct game_id) as elim_results
        from playergame as pg
        where alignment_id in (select alignment_id from alignment where is_elim)
        group by win
),

all_games as (select sum(elim_results) as s from e_games),

won_games as (select sum(elim_results) as won from e_games where win)

select (won / s) as elim_win_perc from all_games, won_games;


-- avg game length by outcome-------------

-- all factions that won for each game and how many ppl 
WITH by_game AS (
    select game_id, alignment_id, count(player_id) as num_won
    from playergame
    where win
    group by game_id, alignment_id
    order by game_id
),

-- above with cycle length for each game
with_nums AS (
    SELECT * 
    FROM by_game 
        NATURAL JOIN (select game_id, num_cycles from game) AS cycle_nums
), 

-- grouped by alignment
by_alignment AS (
    SELECT alignment_id, avg(num_cycles) as avg_cycle, count(num_cycles) as num_games
    FROM with_nums 
    GROUP BY alignment_id
)

-- adding alignment description
SELECT alignment_desc, avg_cycle, num_games, is_evil 
    FROM by_alignment NATURAL JOIN alignment;

        