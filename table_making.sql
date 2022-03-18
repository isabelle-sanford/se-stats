-- ! Player
CREATE TABLE player (
    player_id INT GENERATED ALWAYS AS IDENTITY,
    player_name VARCHAR,
    PRIMARY KEY (player_id)
);

-- ! Game
CREATE TABLE game (
    game_id INT GENERATED ALWAYS AS IDENTITY,
    game_format CHAR(2),
    game_number FLOAT,
    game_string CHAR(6),
    is_anon BOOLEAN,
    broken , -- ?
    IM_id INT,
    start_date DATE,
    end_date DATE,
    num_cycles INT,
    is_sanderson BOOL,
    world VARCHAR(20),
    complexity VARCHAR(20), -- or make sep table
    fundamentals VARCHAR(20), -- or make sep table
    num_posts INT,

    PRIMARY KEY (game_id)
    FOREIGN KEY (IM_id) REFERENCES player(player_id)

    CHECK (world IN ('Sel', 'Scadrial', 'Nalthis', 'Roshar')) --!
)


-- ! Alignment
CREATE TABLE alignment (
    alignment_id INT GENERATED ALWAYS AS IDENTITY,
    alignment_char CHAR,
    alignment_desc VARCHAR,
    is_elim BOOLEAN,
    is_evil BOOLEAN

    PRIMARY KEY (alignment_id)
);

INSERT INTO alignment VALUES('V', 'Village', FALSE, FALSE)


-- ! GMs
CREATE TABLE gms (
    game_id INT,
    player_id INT,
    main_gm BOOLEAN,
    FOREIGN KEY (game_id) REFERENCES game(game_id),
    FOREIGN KEY (player_id) REFERENCES player(player_id)
)


-- ! death
CREATE TABLE death (
    death_id INT GENERATED ALWAYS AS IDENTITY,
    death_char CHAR,
    death_desc VARCHAR,

    PRIMARY KEY (death_id)
)


-- ! Playergame
CREATE TABLE playergame (
    -- maybe have PK - must if want to include roles
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

    -- ? Role


    FOREIGN KEY (player_id) REFERENCES player, -- col doesn't have to be specified, default is table's PK
    FOREIGN KEY (game_id) REFERENCES game(game_id),
    FOREIGN KEY (alignment_id) REFERENCES alignment,
    FOREIGN KEY (death_id) REFERENCES death
)

-- roles? 