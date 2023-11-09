
from fastapi import FastAPI, Depends, Response
from .session import SessionData, verifier, cookie,  backend
from uuid import UUID, uuid4
from datetime import datetime
from .game import game_create, game_handle_action
from .models import InboundAction


app = FastAPI()


@app.post("/create", dependencies=[Depends(cookie)])
async def create_session(response: Response, session_data: SessionData = Depends(verifier)):

    if session_data:
        print('session already exists')
        return session_data.model_dump()

    
    session = uuid4()
    session_data = SessionData(
        created=datetime.now(),
        game=game_create()
    )

    await backend.create(session, session_data)
    cookie.attach_to_response(response, session)

    print('create new session', session_data.model_dump())
    return session_data.model_dump()
    

@app.post("/delete", dependencies=[Depends(cookie)])
async def delete_session(response: Response, session_id: UUID = Depends(cookie)):
    
    try:
        await backend.delete(session_id)
        cookie.delete_from_response(response)
        print("deleted session", session_id)
    except:
        print('no session')

    return None




@app.post("/action", dependencies=[Depends(cookie)])
async def action( action:InboundAction, session_data: SessionData = Depends(verifier), session_id: UUID = Depends(cookie)):
    game_handle_action(session_data.game, action)
    await backend.update(session_id, session_data)
    return session_data.model_dump()
