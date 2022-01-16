from mysql.connector import connect, Error
import os
from dotenv import load_dotenv
load_dotenv()
import hashlib
import base64


mydb = connect(host="localhost",user="root", password=os.getenv("MYSQL_PASSWORD"), database='Users')
cursor = mydb.cursor()


def LoginUser(name,password):
    cursor.execute(f"SELECT * FROM Persons WHERE Username='{name}'")
    res=cursor.fetchall()
    userpass=password
    hashpass=hashlib.sha256(userpass.encode())
    # if(len(res)==0):
    #     return {"msg":"Incorrect Username or Password","loggedIn":False}
    print(res)
    if(res[0][2]==hashpass.hexdigest()):
        return {"msg":"correct Username or Password","loggedIn":True,"data":res}
    else:
        return {"msg":"Incorrect Username or Password","loggedIn":False}

def getAllUsers():
    cursor.execute("SELECT * FROM users")
    res=cursor.fetchall()
    return res


def creatUser(name,password):
    strin = password
    hashPass = hashlib.sha256(strin.encode())
    password = hashPass.hexdigest()
    cursor.execute(f"SELECT * FROM Persons WHERE Username = '{name}'")
    res = cursor.fetchall()
    if(res):
        return {"msg":"Username Already Exists","SignUp":False}
    else:
        query = 'INSERT INTO Persons (Username, Password) VALUES(%s,%s)'
        values = (name, password)
        cursor.execute(query, values)
        mydb.commit()
        return {"msg":"User Created In","SignUp":True}


def insertImage(Userid,ImageString,ImageTitle,Date,labels,confidence):
    try:
        query="Insert Into Images (UserId,ImageString,Title,createOn,Labels,confidence) VALUES (%s,%s,%s,%s,%s,%s)"
        values=(Userid,ImageString,ImageTitle,Date,labels,confidence)
        cursor.execute(query,values)
        mydb.commit()
        return "Image Uploaded"
    except Exception as e:
        return e

def getUserImages(Userid):
    try:
        cursor.execute(f"SELECT * from Images where UserID={Userid}")
        results=cursor.fetchall()
        return results
    except Exception as e:
        return e


