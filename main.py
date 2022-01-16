from typing import Optional
from fastapi import FastAPI, Response, status, HTTPException, Depends, Cookie
import hashlib
import os
import base64
import jwt
from auth import authentication
from fastapi import APIRouter, Form,UploadFile, File
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
from fastapi import Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import rekog
import json
load_dotenv()
from database import db

class login(BaseModel):
    username:str
    password:str
class token(BaseModel):
    token:str

class uploadImage(BaseModel):
    userId:int
    base64:str
    title:str
    Date:str



app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/test")
async def root():
    return {'msg':"Abubakar"}


@app.post("/login")
async def root(login:login):
    results=db.LoginUser(login.username,login.password)
    if(results['loggedIn']==False):
        return {"msg":results,"status":False}

    token=authentication.encodeToken(results)
    print("encoded: ",results)
    return {"token":token,'status':True}


@app.post("/userImgs")
async def root(token:token):
    results=authentication.decodeToken(token.token)
    
    if(results['status']==True):
        imgs=results['token']['name']['data'][0][0]
        dbimgs=db.getUserImages(imgs)
        return {"res":results,"images":dbimgs}
    
    return {"res":results,"images":None}

@app.post("/postImage")
async def root(imgUpload:uploadImage):
    rekognition=rekog.imgLabels(imgUpload.base64)
    labels=",".join(rekognition[0])
    confidence = [str(element) for element in rekognition[1]]
    conf=",".join(confidence)
    res=db.insertImage(imgUpload.userId,imgUpload.base64,imgUpload.title,imgUpload.Date,labels,conf)
    return res


