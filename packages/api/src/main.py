
from fastapi import FastAPI, Depends, Response
from .session import SessionData, verifier, cookie,  backend
from uuid import UUID, uuid4
from datetime import datetime
from .game import GameOfUr
from .models import InboundAction


app = FastAPI()



@app.post("/create", dependencies=[Depends(cookie)])
async def create_session(response: Response, session_data: SessionData = Depends(verifier)):

    
    # Game exists
    if session_data:
        if session_data.game:
            game = GameOfUr(**session_data.game)
        print('A session already exists.', session_data.model_dump() )
        return game.to_dict()

    # New game
    game = GameOfUr(debug=True, coins_per_player=7)
    session = uuid4()
    session_data = SessionData(
        created=datetime.now(),
        game=vars(game)
    )

    # Store to backend
    await backend.create(session, session_data)
    cookie.attach_to_response(response, session)

    print('Create new session', session_data.model_dump())
    return game.to_dict()

    

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
    
    if session_data.game:
        game = GameOfUr(**session_data.game)
        game.exec(action=action)

        session_data.game = vars(game)

        await backend.update(session_id, session_data)
        return game.to_dict()

    return None