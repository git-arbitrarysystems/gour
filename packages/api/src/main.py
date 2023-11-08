
from fastapi import FastAPI
import json
app = FastAPI()


@app.get("/")
async def root():
    return {"greeting": "Hello world"}


@app.get("/init")
async def init():
    return dict(
            board=[
                [None,None,None,None,7,0,None,None],
                [None,None,None,None,None,None,None,None],
                [None,None,None,None,7,0,None,None]
            ],
            player=None,
            dice=None,
            next="SELECT_PLAYER"
        ) 
    


