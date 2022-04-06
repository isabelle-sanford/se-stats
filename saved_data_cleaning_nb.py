# %% [markdown]
# ## Tables to create
# 
# Key tables
# * alignment
# * death
# * roles
# * settings
# 
# Data tables
# * player (just player name & id)
# * game (general stats about each game)
# * gms (gms for each game)
# * playergame (each player's stats in each game)
# * player_roles (roles for a row in playergame)

# %%
import pandas as pd 

# %%
# KEY TABLES

alignment = pd.read_csv("data/keys/alignment.csv").reset_index().rename(columns={"index": "alignment_id"})

print(alignment.head())

settings = pd.read_csv("data/keys/settings.csv")

print(settings.head())

death = pd.read_csv("data/keys/death.csv").reset_index().rename(columns={"index": "death_id"})

death.head()

# %%
# IMPORTING DATA TAB
data = pd.read_csv("data/original_data/original_data.csv")

data.rename(inplace=True, columns={
    "Player": "player_name",
    "Alignment": "alignment_char",
    "Faction Outcome": "win", 
    "First Hit": "first_hit", 
    "Last Hit": "last_hit",
    "# of Hits": "num_hits",
    "Death/\r\n Survival": "death_char", # ???
    "Inactive": "inactive",
    "Mod": "IM",
    "Game Type": "format",
    "Game #": "game_num",
    "Unnamed: 14": "game_string",
    "Role": "role",
    "Unnamed: 17": "secondary_role"
    # MAIN GM 
    })

data.head()

# more cleaning here? 

# %%


# %%
# IMPORTING GAME TAB

# header = 1 because there's an extra header row on top w categories
game = pd.read_csv("data/original_data/original_game_3-28.csv", header=1)

# cols wanted: id, format, number, string, anon num,
# mech balance, dist balance, IM id, start date, end date
# num cycles, num posts, setting id
# complexity, fundamentals, role madness

# cols still needed: format, number, mech balance, dist balance, 
# IM id, start date, end date, setting id

game.reset_index(inplace=True)

# ! Need to be careful about sheet renaming cols - some kind of check?
game.rename(inplace=True, columns={
    "index": "game_id",
    "auto?": "game_string",
    # GAME FORMAT
    # GAME NUM
    "# Players": "num_players", # optional
    "# Cycles": "num_cycles",
    "# Posts": "num_posts",
    "Fundamentals": "fundamentals", 
    "Role Madness": "role_madness",
    "Winner": "winner", # optional
    "Complexity": "complexity",
    "Broken": "broken", # TODO make into mech/dist once that's set in sheet
    # MECH
    # DIST
    "World": "world", # need to make setting table and replace this w setting_id
    "Anon?": "anon_num", # currently still boolean
    "Title/Link": "title" # need to get link separately. hidden col? 
    # LINK
    })

print(game.columns)

# remaining columns are just calculated from data test
game = game.filter([
    "game_id",
    "game_string", 
    "num_players",
    #"IM", # currently blank - pulling from Data instead
    "num_cycles", 
    "num_posts", 
    "fundamentals", 
    "role_madness",
    "winner", 
    "complexity", 
    "broken", 
    "world",
    "anon_num",
    "title"
])


game.tail()
# check for almost all NaN rows! extra checkboxes cause this

# %%
# PLAYER
unique_players = data["player_name"].unique()

player = pd.DataFrame({"player_id": range(len(unique_players)), "player_name": unique_players})

player.to_csv("data/player1.csv", index=False)

player.head()


# %%
# SETTINGS, DEATH, ALIGNMENT

unique_worlds = game["world"].unique()

new_settings = []

for world in unique_worlds:
    if world not in settings["world"].unique():
        new_settings.append({"world": world, "is_sanderson": False, "is_cosmere": False})
        print(f"inserted {world}")

new_settings_df = pd.DataFrame(new_settings)

settings = pd.concat([settings, new_settings_df], ignore_index=True).reset_index().rename(columns={"index": "setting_id"})

settings.tail()

# TODO: check this against key table settings for worlds not in it
# for each loc not there, put down as non-Sanderson and print that you're doing so

# do the same check with unique death and alignment tables, but don't insert by default - just print thing

# %%
# checking death / alignment

al = data["alignment_char"].unique()

for a in al:
    if a not in alignment["alignment_char"].unique():
        print(a)



de = data["death_char"].unique()

for d in de:
    if d not in death["death_char"].unique():
        print(d)




# %%
data.dtypes

# %%
settings.dtypes

# %%
# TODO id replacements:
# in PG - player_id, game_id, alignment_id, death_id

merged_data = data.merge(player, on="player_name", how="left")

merged_data = merged_data.merge(game.filter(["game_id", "game_string"]), on="game_string", how="left")

merged_data = merged_data.merge(alignment.filter(["alignment_id", "alignment_char"]), on="alignment_char", how="left")

merged_data = merged_data.merge(death.filter(["death_id", "death_char"]), on="death_char", how="left")

merged_data.head()
# in game - setting_id

game = game.merge(settings, on="world", how="left")

# %%


# %%
merged_data.columns

# %%
# Pull rest of stuff into game table from PG: IM id, format/number(?)

IM_list = merged_data[merged_data["IM"] == "Y"].filter(["player_id", "game_id"])

games = game.merge(IM_list, on="game_id", how="left").rename(columns={"player_id": "IM_id"})

game.head()
# export games to csv (optionally)

# %%
# make GMs table from PG

gms = merged_data[merged_data["GM"] == "Y"].filter(["player_id", "game_id"])

#gms.rename(columns={"player_id": "gm_id"}, inplace=True)

# ! MAIN GM

gms.head()

# optionally export gms table

# %%
# if roles are in, make roles table

# %%
# clean PG - take out GM, spec, IM, ??


playergame = merged_data[merged_data["GM"] != "Y"]
playergame = playergame[playergame["IM"] != "Y"]
playergame = playergame[playergame["Spec"] != "Y"]

playergame = playergame.filter(['win', 'first_hit', 'last_hit', 'num_hits', 'inactive', 'Broken', 'player_id', 'game_id', 'alignment_id', 'death_id'])

# TODO: change Y -> True, nan -> False
# win W/L/D -> True/False/null

playergame = playergame.reset_index().rename(columns={"index": "pg_id"})


# optionally export playergame table

# %%
playergame.head()

# %%
game.head()

# %%
alignment.head()

# %%
death.head()

# %%
print(player.head())
print(gms.head())
print(settings.head())

# %%
player.loc[300]

# %%
player["player_name"] = player["player_name"].str.replace("\'", "")
game["num_cycles"] = game["num_cycles"].str.replace("?", "", regex=False)
gms = gms.convert_dtypes() # TODO put this way higher


game = game.fillna(None)
game = game.convert_dtypes()

# %%
game.head()

# %%
game.iloc[27]

# %%


# %%
player.loc[300]

# %% [markdown]
# At this point should have the tables:
# * playergame
# * games (game)
# * player
# * gms
# * alignment
# * death
# * settings
# 
# time for...
# ## SQL Insertion
# 

# %%
import psycopg2
db = 0

# %%
if db != 0:
    cnx = psycopg2.connect(user="dbuser", database="isanford", host="localhost", password="12345678")
    cursor = cnx.cursor()


# %%
# PLAYER
#db = 0
cc = 0 

for row in player.iterrows():
    ins = "insert into player (player_id, player_name) values ({}, '{}');"
    ins = ins.format(row[1]["player_id"], row[1]["player_name"])

    if db == 1:
        try: 
            cursor.execute(ins)
        except:
            print(row)
            print(ins)
            cc = cc + 1

    else: 
        print(ins)
    

print(f"Num errors: {cc}")


# %%
# KEY TABLES

# ALIGNMENT

cc = 0 

for row in alignment.iterrows():
    tup = row[1]
    ins = "INSERT INTO alignment (alignment_id, alignment_char, alignment_desc, is_elim, is_evil, has_kill, has_convert) VALUES({},'{}','{}','{}','{}','{}','{}');"

    ins = ins.format(tup["alignment_id"], tup["alignment_char"], tup["alignment_desc"], tup["is_elim"], tup["is_evil"], tup["has_kill"], tup["has_convert"], tup["was_converted"])

    if db == 1:
        try: 
            cursor.execute(ins)
        except:
            print(tup)
            print(ins)
            cc = cc + 1

    else: 
        print(ins)


print(f"Num errors: {cc}")


# %%
# KEY TABLES

cc = 0 

# optional: also add other cols if they're reasonable

for row in death.iterrows():
    tup = row[1]
    ins = "INSERT INTO death (death_id, death_char, death_desc) VALUES({},'{}','{}');"

    ins = ins.format(tup["death_id"], tup["death_char"], tup["death_desc"])

    if db == 1:
        try: 
            cursor.execute(ins)
        except:
            print(tup)
            print(ins)
            cc = cc + 1

    else: 
        print(ins)


print(f"Num errors: {cc}")


# %%
# KEY TABLES

cc = 0 

# optional: also add other cols if they're reasonable

for row in settings.iterrows():
    tup = row[1]
    ins = "INSERT INTO setting (setting_id, world, is_sanderson, is_cosmere) VALUES({},'{}','{}','{}');"

    ins = ins.format(tup["setting_id"], tup["world"], tup["is_sanderson"], tup["is_cosmere"])

    if db == 1:
        try: 
            cursor.execute(ins)
        except:
            print(tup)
            print(ins)
            cc = cc + 1

    else: 
        print(ins)
        

print(f"Num errors: {cc}")


# %%
# KEY TABLES

cc = 0 

for row in game.iterrows():
    tup = row[1]
    ins = "INSERT INTO game (game_id, game_format, game_number, game_string, anon_num, mechanics_balance, distribution_balance, IM_id, start_date, end_date, num_cycles, num_posts, setting_id, complexity, fundamentals, role_madness) VALUES({},'{}','{}','{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}')"

    ins1 = "INSERT INTO game (game_id, game_string, anon_num, num_cycles, num_posts, setting_id, complexity, fundamentals, role_madness) VALUES({},'{}','{}','{}', '{}', '{}', '{}', '{}', '{}')"

    ins1 = ins1.format(
        tup["game_id"], 
        #tup["game_format"], 
        #tup["game_number"], 
        tup["game_string"], 
        tup["anon_num"],
        #tup["mechanics_balance"], #not yet
        #tup["distribution_balance"], # not yet
        # tup["IM_id"], #?????
        #tup["start_date"], # not yet
        #tup["end_date"], # not yet
        tup["num_cycles"], 
        tup["num_posts"],
        tup["setting_id"],
        tup["complexity"],
        tup["fundamentals"],
        tup["role_madness"] # ??
    )

    if db == 1:

        cursor.execute(ins1)


    else: 
        print(ins1)


print(f"Num errors: {cc}")

# %%
# KEY TABLES

cc = 0 

# optional: also add other cols if they're reasonable

for row in gms.iterrows():
    tup = row[1]
    ins = "INSERT INTO gms (game_id, player_id) VALUES({},{});"

    ins = ins.format(tup["game_id"], tup["player_id"])

    if db == 1:
        try: 
            cursor.execute(ins)
        except:
            print(tup)
            print(ins)
            cc = cc + 1

    else: 
        print(ins)


print(f"Num errors: {cc}")


# %%
cc = 0 

for row in playergame.iterrows():
    tup = row[1]
    ins = "INSERT INTO playergame (pg_id, player_id, game_id, alignment_id, death_id, first_hit, last_hit, num_hits, win, pinchhitter, inactive) VALUES('{}','{}','{}','{}', '{}', '{}', '{}', '{}', '{}', '{}')" #, '{}')"

    ins = ins.format(
        tup["pg_id"], 
        tup["player_id"], 
        tup["game_id"], 
        tup["alignment_id"], 
        tup["death_id"],
        tup["first_hit"], 
        tup["last_hit"], 
        tup["num_hits"],
        tup["win"], 
        #tup["pinchhitter"], # not yet
        tup["inactive"]
    )

    if db == 1:
        try: 
            cursor.execute(ins)
        except:
            print(tup)
            print(ins)
            cc = cc + 1

    else: 
        print(ins)
    

print(f"Num errors: {cc}")

# %%
if db != 0:
    cnx.commit()
    cursor.close()
    cnx.close()

# %%



