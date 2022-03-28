
\c isanford;


drop table if exists player;
drop table if exists game;
drop table if exists alignment;
drop table if exists gms;
drop table if exists death;
drop table if exists playergame;
drop table if exists roles;
drop table if exists player_roles;
drop table if exists settings;


-- ! Player
CREATE TABLE player (
    player_id INT,
    player_name VARCHAR UNIQUE NOT NULL,
    PRIMARY KEY (player_id)
);

-- ! Game
CREATE TABLE game (
    game_id INT, 
    game_format CHAR(2) NOT NULL,
    game_number FLOAT NOT NULL,
    game_string CHAR(6) UNIQUE NOT NULL,
    anon_num NULL INT, -- num only if anon else null

    -- ??
    mechanics_balance CHAR(1) NOT NULL,
    distribution_balance CHAR(1) NOT NULL,

    IM_id INT,
    start_date DATE,
    end_date DATE,
    num_cycles INT,
    num_posts INT,

    setting_id INT,

    complexity VARCHAR(20), -- or make sep table
    fundamentals VARCHAR(20), -- or make sep table
    role_madness BOOLEAN,

    -- optionally num players, winner, title, link

    PRIMARY KEY (game_id)
    FOREIGN KEY (IM_id) REFERENCES player(player_id)
    FOREIGN KEY (setting_id) REFERENCES setting
    CHECK format_con (game_format IN ('LG', 'AG', 'MR', 'QF', 'BT')) -- may need to change at some point

    CHECK (mechanics_balance IN ('BB', 'B', 'M', 'MM')) -- probs should be sep table sigh
    CHECK (distribution_balance IN ('BB', 'B', 'D', 'DD')) -- again sep table (or at least enum, since ordered)

)


-- ! Alignment
CREATE TABLE alignment (
    alignment_id INT,
    alignment_char CHAR UNIQUE, 
    alignment_desc VARCHAR,
    is_elim BOOLEAN,
    is_evil BOOLEAN,
    has_kill BOOLEAN,
    has_convert BOOLEAN,

    PRIMARY KEY (alignment_id)
);

--INSERT INTO alignment VALUES('V', 'Village', FALSE, FALSE)


-- ! GMs
CREATE TABLE gms (
    game_id INT,
    player_id INT,
    main_gm BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (game_id) REFERENCES game(game_id),
    FOREIGN KEY (player_id) REFERENCES player(player_id)
)


-- ! death
CREATE TABLE death (
    death_id INT,
    death_char CHAR UNIQUE,
    death_desc VARCHAR,

    PRIMARY KEY (death_id)
)


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
    win NULL BOOLEAN, -- ? 
    pinchhitter BOOLEAN,
    inactive BOOLEAN,

    PRIMARY KEY (pg_id),
    FOREIGN KEY (player_id) REFERENCES player, -- col doesn't have to be specified, default is table's PK
    FOREIGN KEY (game_id) REFERENCES game(game_id),
    FOREIGN KEY (alignment_id) REFERENCES alignment,
    FOREIGN KEY (death_id) REFERENCES death
)

-- roles? 

-- ! Roles
CREATE TABLE roles (
    role_id INT,
    role_type VARCHAR, -- check constraint probs
    role_name VARCHAR

    PRIMARY KEY (role_id)
)

-- ! Roles data
CREATE TABLE player_roles (
    pg_id INT,
    role_id INT,

    FOREIGN KEY (pg_id) REFERENCES playergame,
    FOREIGN KEY (role_id) REFERENCES roles
)



CREATE TABLE settings (
    world_id INT,
    world_name VARCHAR,
    is_sanderson BOOLEAN,
    is_cosmere BOOLEAN,

    PRIMARY KEY (world_id)
)