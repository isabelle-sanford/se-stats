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
import numpy as np

# %%
# KEY TABLES

alignment = pd.read_csv("data/keys/alignment.csv").reset_index().rename(columns={"index": "alignment_id"})
print(alignment.head())

setting = pd.read_csv("data/keys/setting.csv")
print(setting.head())

death = pd.read_csv("data/keys/death.csv").reset_index().rename(columns={"index": "death_id"})
death.head()

# %%
# IMPORTING DATA TAB
data = pd.read_csv("data/original_data/orig_data_040622.csv")

data.rename(inplace=True, columns={
    "ID": "pg_id",
    "Player": "player_name",
    "Alignment": "alignment_char",
    "Faction Outcome": "win", 
    "First Hit": "first_hit", 
    "Last Hit": "last_hit",
    "# of Hits": "num_hits",
    "Death/\n Survival": "death_char", # ???
    "Inactive": "inactive",
    "Mod": "IM",
    "Game Type": "game_format",
    "Game #": "game_num",
    "Unnamed: 15": "game_string", # these depend on other cols. name in sheet pls
    "Role": "role",
    "Unnamed: 18": "secondary_role",
    "Main?": "main_gm"
    })

data = data.filter([
    "pg_id", 
    "player_name",
    "alignment_char",
    "win",
    "first_hit", "last_hit", "num_hits",
    "death_char",
    "inactive",
    "GM", "main_gm", "IM", # "Spec",
    "game_string", #"game_format", "game_num",
    "role", "secondary_role"
    ])

data.head()

# more cleaning here? 

# %%
# IMPORTING GAME TAB

# header = 1 because there's an extra header row on top w categories
game = pd.read_csv("data/original_data/orig_game_040622.csv", header=1)

# cols wanted: id, format, number, string, anon num,
# mech balance, dist balance, IM id, start date, end date
# num cycles, num posts, setting id
# complexity, fundamentals, role madness

# cols still needed: mech balance, dist balance, 
# start date, end date

game.reset_index(inplace=True)

game.columns

# %%

# ! Need to be careful about sheet renaming cols - some kind of check?
game.rename(inplace=True, columns={
    "index": "game_id",
    "format": "game_format",
    "num": "game_num", 
    "auto?": "game_string", # optional? 
    #"# Players": "num_players", # optional
    "# Cycles": "num_cycles",
    "# Posts": "num_posts",
    "Fundamentals": "fundamentals", 
    "Role Madness": "role_madness",
    #"Winner": "winner", # optional
    "Complexity": "complexity",
    #"Broken": "broken", # TODO make into mech/dist once that's set in sheet
    "Mech": "mechanics_balance", # blank rn!!
    "Dist": "distribution_balance",
    "World": "setting", # need to make setting table and replace this w setting_id
    "Anon": "anon_num", 
    "Title/Link": "title", # need to get link separately. hidden col? 
    # LINK
    "start_date": "start_date",
    "end_date": "end_date"
    })

print(game.columns)

# remaining columns are just calculated from data test
game = game.filter([
    "game_id",
    "game_format", "game_num", "game_string",
    "num_players",
    #"IM", # currently blank - pulling from Data instead
    "num_cycles", 
    "num_posts", 
    "fundamentals", "role_madness", "complexity", 
    "winner", 
    "mechanics_balance", "distribution_balance",
    #"broken", 
    "setting",
    "anon_num",
    "title",
    "start_date", "end_date"
])


game.tail()
# check for almost all NaN rows! extra checkboxes cause this

# %% [markdown]
# END CLEANING 
# 
# # SQL table making

# %%
# PLAYER - DONE
unique_players = data["player_name"].unique()

player = pd.DataFrame({"player_id": range(len(unique_players)), "player_name": unique_players})

player.head()


# %%
# SETTINGS - DONE

unique_worlds = game["setting"].unique()

new_settings = []

# for each loc not there, put down as non-Sanderson and print that you're doing so
for world in unique_worlds:
    if world not in setting["setting"].unique():
        if (str(world) == "nan"): # don't want to insert NaN worlds
            continue # check
        new_settings.append({"setting": world, "is_sanderson": False, "is_cosmere": False})
        print(f"inserted {world}")

new_settings_df = pd.DataFrame(new_settings)

setting = pd.concat([setting, new_settings_df], ignore_index=True).reset_index().rename(columns={"index": "setting_id"})

setting.tail()


# %%
# ALIGNMENT / DEATH
# do the same check as above with unique death and alignment tables, but don't insert by default - just print thing

al = data["alignment_char"].unique()

for a in al:
    if a not in alignment["alignment_char"].unique():
        print(a)



de = data["death_char"].unique()

for d in de:
    if d not in death["death_char"].unique():
        print(d)


# TODO fix rows with these things (or could do in SQL insertion or merge)
# currently I think merge just has them as NaN so SQL makes them null? which works 

# %%
# in PG - player_id, game_id, alignment_id, death_id

s = pd.Series(player.set_index("player_name")["player_id"])
data["player_id"] = data["player_name"].map(s)

s = pd.Series(game.set_index("game_string")["game_id"])
data["game_id"] = data["game_string"].map(s)

s = pd.Series(alignment.set_index("alignment_char")["alignment_id"])
data["alignment_id"] = data["alignment_char"].map(s)

s = pd.Series(death.set_index("death_char")["death_id"])
data["death_id"] = data["death_char"].map(s)

data.head()


# %%
s = pd.Series(setting.set_index("setting")["setting_id"])
g = game["setting"].map(s)
game["setting_id"] = g.copy() # copy might not be necessary?
game.head()

# %%
# Pull rest of stuff into game table from PG: IM id

# because apparently Wilson was 'backup IM' for Orlok for QF38. DEFINITELY change this to be more robust
IM_list = data[data["IM"] == "Y"].filter(["player_id", "game_id"]).drop(4313)
#IM_list["game_id"].astype("int", copy=False)

game = game.merge(IM_list, on="game_id", how="left").rename(columns={"player_id": "IM_id"})

game.tail()


# %%
game_final = game.filter([
    "game_id", "game_format", "game_num", "game_string",
    "anon_num", #"mechanics_balance", "distribution_balance",
    "IM_id", "num_cycles", "num_posts", #"start_date", "end_date",
    "title", "setting_id",
    "complexity", "fundamentals", "role_madness"
    ])

# null / nan works just fine for these
# game_final["IM_id"] = game_final["IM_id"].fillna(None) # doesn't work
# game_final["num_cycles"] = game_final["num_cycles"].fillna(-1)
# game_final["num_posts"] = game_final["num_posts"].fillna(-1)


game_final.head()


# %%
# make GMs table from PG

gms = data[data["GM"] == "Y"].filter(["player_id", "game_id", "main_gm"])

#gms.rename(columns={"player_id": "gm_id"}, inplace=True) # not how SQL table is rn. Maybe should be? 

gms["main_gm"] = gms["main_gm"].map({"Y": True, "nan": False, np.nan: False})

gms.head()


# %%
# if roles are in, make roles table here

# %%
# clean PG 


playergame = data[data["GM"] != "Y"]
playergame = playergame[playergame["IM"] != "Y"]
# playergame = playergame[playergame["Spec"] != "Y"] # spec is filtered out at start atm


playergame["win"] = playergame["win"].map({"W": True, "L": False, "D": np.nan})
playergame["inactive"] = playergame["inactive"].map({"Y": True, "NaN": False, np.nan: False})

playergame = playergame.filter(['pg_id', 'player_id', 'game_id', 'alignment_id','death_id', 'first_hit', 'last_hit', 'num_hits', 'win', 'inactive' ])

#playergame = playergame.convert_dtypes() #nvm do not

playergame.head()


# %%
# OPTIONAL: CSV EXPORTS 
# player.to_csv("data/player.csv", index=False)
# playergame, game, alignment, death, blah blah blah

# %%
# removing bad characters

# removes ? in MR7. Definitely need to find a way to do typing better though
game_final["num_cycles"] = game_final["num_cycles"].str.replace("?", "")

game_final.iloc[25:30]


# %%
import psycopg2
db = 1

# %%
if db != 0:
    cnx = psycopg2.connect(user="isanford_123", database="isanford", host="localhost", password="12345678")
    cursor = cnx.cursor()


# %%
def insertion_maker(db, db_name): # not sure name is necessary
    ins_base = f"insert into {db_name} ("
    ins_cols = ",".join(list(db.columns)) 

    ins = f"{ins_base}{ins_cols}) values (" 

    vals = ",".join(["%s" for col in db.columns])

    ins += vals + ");"

    return ins


# %%
def insert_table(db, db_name, cursor = 0):
    base = insertion_maker(db, db_name)

    err_ct = 0

    for row in db.iterrows():
        row_data = [r if str(r) != "nan" else None for r in row[1]]

        if (cursor != 0):
            try:
                cursor.execute(base, row_data)
            except: # how do I also make it print the error
                print(base)
                print(row_data) 
                err_ct += 1
                print(row[0])
                return # for now

        else:
            print(row_data)
    
    print(f"{err_ct} errors inserting data into {db_name}.")


# %%
# NOTE: insert_table REQUIRES that every column in table is set to go into db under same name

insert_table(player, "player", cursor)
insert_table(setting, "setting", cursor)
insert_table(alignment, "alignment", cursor)
insert_table(death.filter(["death_id", "death_char", "death_desc"]), "death", cursor) # dubious
insert_table(game_final, "game", cursor)
insert_table(gms, "gms", cursor)
insert_table(playergame, "playergame", cursor)
# (roles)

cnx.commit() # brave

# %%
cursor.close()
cnx.close()

# %% [markdown]
# END (hopefully)


