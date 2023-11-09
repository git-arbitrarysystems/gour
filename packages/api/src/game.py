from random import randint
from .models import GameData, OutboundAction, InboundAction







def game_create():
    print('game_create')
    return game_get_next_action(
        GameData(
            board=[
                [randint(0,1), randint(0,1), randint(0,1), None, 7, 0, None, None],
                [None, None, None, None, None, None, None, None],
                [None, None, None, None, 7, 0, None, None]
            ],
            player=None,
            dice=None
        )
    )


def game_roll(gamedata):
    gamedata.dice = [
        randint(0, 1),
        randint(0, 1),
        randint(0, 1),
        randint(0, 1)
    ]


def game_get_next_action(gamedata: GameData):
    print('game_get_next_action')
    if gamedata.player == None:
        gamedata.next=OutboundAction(
            action='SELECT_PLAYER',
            options=["RAND", 0, 1]
        )
    return gamedata


def game_handle_action(gamedata: GameData, action: InboundAction):
    if action.action == "SELECT_PLAYER":
        if action.value == 0 or action.value == 1:
            gamedata.player = action.value
        elif action.value == "RAND":
            gamedata.player = randint(0, 1)
        else:
            raise Exception(f'Invalid value for action {
                            action.action} ({action.value})')
        
    
    gamedata.next = None
    return gamedata
