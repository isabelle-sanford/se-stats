-- LAST MODIFIED 4/26/22 (made game_string varchar not char(6), added winner to game)


\c isanford;

-- TODO put materialized view dropping here
drop table if exists player_roles;
drop table if exists roles;
drop table if exists playergame;
drop table if exists death;
drop table if exists alignment;
drop table if exists gms;
drop table if exists game;
drop table if exists setting;
drop table if exists player;


-- ! Player
CREATE TABLE player (
    player_id INT,
    player_name VARCHAR UNIQUE NOT NULL,
    PRIMARY KEY (player_id)
);

CREATE TABLE setting (
    setting_id INT,
    setting VARCHAR,
    is_sanderson BOOLEAN, -- could have defaults here? 
    is_cosmere BOOLEAN,

    PRIMARY KEY (setting_id)
);

-- ! Alignment
CREATE TABLE alignment (
    alignment_id INT,
    alignment_char CHAR UNIQUE, 
    alignment_desc VARCHAR,
    is_elim BOOLEAN,
    is_evil BOOLEAN,
    has_kill BOOLEAN,
    has_convert BOOLEAN,
    was_converted BOOLEAN,

    PRIMARY KEY (alignment_id)
);

-- ! death
CREATE TABLE death (
    death_id INT,
    death_char CHAR UNIQUE,
    death_desc VARCHAR,
    -- could have more here? see CSV/key sheet

    PRIMARY KEY (death_id)
);


-- ! Game
CREATE TABLE game (
    game_id INT, 
    game_format CHAR(2) NOT NULL,
    game_num FLOAT NOT NULL,
    game_string VARCHAR UNIQUE NOT NULL, -- optional but nice
    anon_num INT, 

    -- ??
    mechanics_balance CHAR(2),
    distribution_balance CHAR(2),
    winner VARCHAR, -- new!

    IM_id INT,
    start_date DATE,
    end_date DATE,
    num_cycles INT,
    num_posts INT,
    
    title VARCHAR,
    link VARCHAR,

    setting_id INT,

    complexity VARCHAR(20), -- or make sep table
    fundamentals VARCHAR(20), -- or make sep table
    role_madness BOOLEAN,
    -- PM structure apparently?

    -- optionally num players, winner, title, link

    PRIMARY KEY (game_id),
    FOREIGN KEY (IM_id) REFERENCES player(player_id),
    FOREIGN KEY (setting_id) REFERENCES setting --,
    
    -- hopefully works? TODO TEST
    -- nope doesn't work
    --CHECK format_con (game_format IN ('LG', 'AG', 'MR', 'QF', 'BT')), -- may need to change at some point

    -- CHECK (mechanics_balance IN ('BB', 'B', 'M', 'MM')), -- probs should be sep table sigh
    -- CHECK (distribution_balance IN ('BB', 'B', 'D', 'DD')) -- again sep table (or at least enum, since ordered)

);

-- ! GMs
CREATE TABLE gms (
    game_id INT,
    player_id INT,
    main_gm BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (game_id) REFERENCES game(game_id),
    FOREIGN KEY (player_id) REFERENCES player(player_id)
);

-- ! Playergame
CREATE TABLE playergame (
    pg_id INT,
    player_id INT,
    game_id INT,
    alignment_id INT,
    death_id INT,
    first_hit INT,
    last_hit INT,
    num_hits INT,
    win BOOLEAN, 
    --pinchhitter BOOLEAN, -- needs to go in initial sheet
    inactive BOOLEAN,

    PRIMARY KEY (pg_id),
    FOREIGN KEY (player_id) REFERENCES player, -- col doesn't have to be specified, default is table's PK
    FOREIGN KEY (game_id) REFERENCES game(game_id),
    FOREIGN KEY (alignment_id) REFERENCES alignment,
    FOREIGN KEY (death_id) REFERENCES death
);

-- roles? 
-- extant but empty for now 

-- ! Roles
CREATE TABLE roles (
    role_id INT,
    role_type VARCHAR, -- check constraint probs
    role_name VARCHAR,

    PRIMARY KEY (role_id)
);

-- ! Roles data
CREATE TABLE player_roles (
    pg_id INT,
    role_id INT,

    FOREIGN KEY (pg_id) REFERENCES playergame,
    FOREIGN KEY (role_id) REFERENCES roles
);




CREATE INDEX players ON playergame
    USING hash
    (player_id);

CREATE INDEX formats ON game 
    USING hash (game_format);


GRANT ALL ON player TO isanford_123;
GRANT ALL ON setting TO isanford_123;
GRANT ALL ON alignment TO isanford_123;
GRANT ALL ON death TO isanford_123;
GRANT ALL ON game TO isanford_123;
GRANT ALL ON gms TO isanford_123;
GRANT ALL ON playergame TO isanford_123;
GRANT ALL ON roles TO isanford_123;
GRANT ALL ON player_roles TO isanford_123;


