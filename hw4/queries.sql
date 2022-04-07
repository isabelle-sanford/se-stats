

-- returns a list of all the games I've played----------
with my_games as (
select game_id from playergame 
    where playergame.player_id IN (select player_id from player where player_name LIKE 'Elbereth')
)

select game_string from game natural join my_games;



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

        