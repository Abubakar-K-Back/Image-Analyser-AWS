import jwt
import datetime

algo="HS256"
secret="secret"
def encodeToken(payload):
    encoded_jwt = jwt.encode({"name": payload,"exp":datetime.datetime.utcnow() + datetime.timedelta(minutes=10)},secret,  algorithm=algo)
    return encoded_jwt
    
def decodeToken(token):
    try:
        return {'token':jwt.decode(token, secret, algorithms=algo),'status':True} 
    except:
        return {'msg':"Token expired",'status':False}

    
    
