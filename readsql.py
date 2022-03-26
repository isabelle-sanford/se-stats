import psycopg2

db=1

def insertStringH(sline):
    insert = "insert into hurricane (hid, name) values('{}', '{}');"
    return insert.format(sline[0].strip(), sline[1].strip());

def insertStringO(hid, sline):
    aa = {'Jan':'01', 'Feb':'02', 'Mar':'03', 'Apr':'04', 'May':'05', 'Jun':'06', 'Jul':'07', 'Aug':'08', 'Sep':'09', 'Oct':'10', 'Nov':'11', 'Dec':'12'}
    insert = "insert into observation (hid, date, time, type, latitude, latitudehemi, longitude, longitudehemi, maxsustained) values('{}', '{}', '{}', '{}', {}, '{}', {},  '{}', {});"
    return insert.format(hid.strip(), sline[0].strip(), sline[1], sline[3].strip(), sline[4][:-1], sline[4][-1], sline[5][:-1], sline[5][-1], sline[6])



def insertPlayer(sline):
    insert = "insert into player (player_id, player_name) values('{}', '{}');"
    return insert.format(sline[0].strip())



if db!=0:
    cnx = psycopg2.connect(user="db_user", database="hurricane", host="localhost", password="12345678")
    cursor = cnx.cursor()


cc=0
with open("hurdat2-1851-2019-052520.txt") as fp:
    line = fp.readline()
    hid=''
    while line:
        spl = line.strip().split(",")
        if len(spl)<6:
            hid=spl[0]
            ins = insertStringH(spl)
        else:
            ins = insertStringO(hid, spl)
        if db==1:
            try:
                cursor.execute(ins)
            except:
                print(line)
                print(ins)
                cc=cc+1
        else:
            print(ins)
        line = fp.readline()

print(cc)

if db!=0:
    cnx.commit()
    cursor.close()
    cnx.close()