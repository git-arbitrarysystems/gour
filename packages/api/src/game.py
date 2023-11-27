from random import randint
from pydantic import BaseModel, ConfigDict
from typing import List, Literal, Optional, Union


class ActionType:
    UNKNOWN_ACTION = "UNKNOWN_ACTION"
    SELECT_PLAYER = "SELECT_PLAYER"
    ROLL_DICE = "ROLL_DICE"
    MOVE = "MOVE"
    NO_MOVES_AVAILABLE = "NO_MOVES_AVAILABLE"



class OutboundAction(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    type: str = ActionType.UNKNOWN_ACTION
    options: List[any] = []


class InboundAction(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    type: str = ActionType.UNKNOWN_ACTION
    value: any = None

class TileType:
    NORMAL = "NORMAL"
    DOUBLE = "DOUBLE"
    START = "START"
    END = "END"

# TileTypeList = [
#     TileType.NORMAL,
#     TileType.DOUBLE,
#     TileType.START,
#     TileType.END
# ]



class GameOfUr:

    #
    # Init
    #
    def __init__(self, 
                 player:Optional[int] = None,
                 boards:Optional[List] = None,
                 dice:Optional[List[int]] = None,
                 available_moves:Optional[List[List[int]]] = None,
                 debug:bool = False
                 ):
        self.player = player
        self.boards = [[7] + [0]*15,[7] + [0]*15] if boards == None else boards
        self.dice = dice
        self.available_moves = available_moves
        self.debug = debug


    # Debug
    def trace(self, *args):
        if self.debug:
            print(*args)

    
    # Get the local board for a player
    def get_board(self, enemy: bool = False):
        if enemy:
            return self.boards[(self.player + 1) % 2]
        return self.boards[self.player]
    
    # Is tile double
    def get_tile_is_double(self, i: int):
        return i in [4, 8, 14]
    
    # Is tile in shared area
    def get_tile_in_shared_area(self, i:int):
        return i >= 5 and i <= 12
    
    # Is there a winner
    def get_winner(self):
        if self.boards[0][15] == 7:
            return 0
        if self.boards[1][15] == 7:
            return 1
        return None
    

    
    # Export the board as 2d tiles
    def get_board_as_tiles(self):

        top = [*self.boards[0][slice(4,0,-1)], self.boards[0][0], *self.boards[0][slice(15,12,-1)]]
        middle = [*self.boards[0][slice(5,13)]]
        middle_enemy = [*self.boards[1][slice(5,13)]]
        bottom = [*self.boards[1][slice(4,0,-1)], self.boards[1][0], *self.boards[1][slice(15,12,-1)]]

        # tile signature: [type, player, chipcount]
        for index, chips_on_tile in enumerate(top):
            top[index] = [
                TileType.START if index == 4 else TileType.END if index == 5 else TileType.DOUBLE if index == 0 or index == 6 else TileType.NORMAL,
                0 if chips_on_tile else None,
                chips_on_tile
            ]

        for index, chips_on_tile in enumerate(middle):
            player_on_tile = 0 if chips_on_tile else 1 if middle_enemy[index] else None
            middle[index] = [
                TileType.DOUBLE if index == 3 else TileType.NORMAL,
                player_on_tile,
                1 if player_on_tile != None else 0
            ]
        
        for index, chips_on_tile in enumerate(bottom):
            bottom[index] = [
                TileType.START if index == 4 else TileType.END if index == 5 else TileType.DOUBLE if index == 0 or index == 6 else TileType.NORMAL,
                1 if chips_on_tile else None,
                chips_on_tile
            ]

        grid = [top,middle,bottom]

        return grid 
    
    # Collect data to return from API
    def to_dict(self):
        return dict(
            action=self.negotiate_next_action(),
            board=self.get_board_as_tiles(),
            player=self.player,
            dice=self.dice,
            winner=self.get_winner()            
        )
    
    def index_to_coordinates(self, index):
        player = [*range(4,-1,-1), *range(15,12,-1)]
        shared = [*range(5,13,1)]
        if index in player:
            y = self.player * 2
            x = player.index(index)
        elif index in shared:
            y = 1
            x = shared.index(index)
        return [x,y]
    
    def coordinates_to_index(self, coords):
        [x,y] = coords
        if y == 1:
            index = 5 + x
        else:
            index = [*range(4,-1,-1), *range(15,12,-1)][x]
        return index


    # Rolling the dice
    def roll(self, value):
        self.dice = value or [randint(0, 1), randint(
            0, 1), randint(0, 1), randint(0, 1)]

    def roll_sum(self):
        if self.dice:
            return sum(self.dice)
        return None

   

    # Get available moves
    def get_available_moves(self):
        
        if self.dice == None:
            return []
        
        steps = self.roll_sum()
        available_moves = []

        if steps > 0:
            board = self.get_board()
            enemyboard = self.get_board(True)
            for from_tile, chips_on_tile in enumerate(board):
                to_tile = from_tile + steps
                if chips_on_tile: # one or more of my chips are on from_tile
                    if to_tile < len(board): # to_tile is not outside board
                        if not (board[to_tile] and to_tile < 15): # my chip is not already there, except if it's the last tile
                            if not (enemyboard[to_tile] and self.get_tile_is_double(to_tile) and self.get_tile_in_shared_area(to_tile) ): # i cannot take an enemy from a protected tile
                                available_moves.append([
                                    self.index_to_coordinates(from_tile),
                                    self.index_to_coordinates(to_tile)
                                ])
        return available_moves

    # Execute a move
    def move(self, _from: int, _to: int):
        board = self.get_board()
        enemyboard = self.get_board(True)
        board[_from] -= 1
        board[_to] += 1
        if self.get_tile_in_shared_area(_to) and enemyboard[_to] > 0:
            enemyboard[_to] -= 1
            enemyboard[0] += 1

    # Jump to next player
    def goto_next_player(self):
        self.player = (self.player+1) % 2

    #
    # Negotiate next action
    #
    def negotiate_next_action(self):

        a = OutboundAction()

        if self.get_winner() == None:
            #
            # No player has been set
            #
            if self.player == None:
                a.type = ActionType.SELECT_PLAYER
                a.options = ['RAND', 0, 1]
            #
            # No dice have been rolled
            #
            elif self.dice == None:
                a.type = ActionType.ROLL_DICE

            #
            # Moves have been made available for current player
            #
            elif self.available_moves != None:
                if len(self.available_moves) == 0:
                    a.type = ActionType.NO_MOVES_AVAILABLE
                else:
                    a.type = ActionType.MOVE
                    a.options = self.available_moves

        return a

    #
    # Pick an option (for autoplay mode)
    #
    def choose(self, action: OutboundAction, choice:Union[Literal['RAND','LAST','FIRST'], int] = 0 ):
        a = InboundAction(type=action.type)
        if type(action.options) == list and len(action.options) > 0:
            if type(choice) == int:
                a.value = action.options[choice]
            elif choice == 'RAND':
                a.value = action.options[randint(0, len(action.options)-1)]
            elif choice == 'LAST':
                a.value = action.options[len(action.options)-1]
            elif choice == 'FIRST':
                a.value = action.options[0]
        return a

    def exec(self, action: InboundAction):

        self.trace(f'\nexec: {action.type} {action.value or ''}')

        #
        # Select player [0,1,RAND]
        #
        if action.type == ActionType.SELECT_PLAYER:
            if action.value == 'RAND':
                self.player = randint(0, 1)
            elif type(action.value) == int:
                self.player = action.value
            self.trace('\tplayer:', self.player)
        #
        # Roll dice
        #
        elif action.type == ActionType.ROLL_DICE:
            self.roll(action.value)
            self.trace('\tvalue:', self.roll_sum(), self.dice)

            self.available_moves = self.get_available_moves()
            self.trace('\tmoves:', self.available_moves)
        #
        #
        #
        elif action.type == ActionType.MOVE:

            # Reset
            self.available_moves = None
            self.dice = None

            if action.value:
                [from_tile, to_tile] = action.value
                [from_tile_index, to_tile_index] = [
                    self.coordinates_to_index(from_tile),
                    self.coordinates_to_index(to_tile)
                ]
                self.move( from_tile_index, to_tile_index )

                self.trace('\tplayer', self.player, 'moved', action.value)
                self.trace('\tboard:', self.boards)

                
                if self.get_winner() == None:
                    if not self.get_tile_is_double(to_tile_index):
                        self.goto_next_player()
                        self.trace('\tselected next player', self.player)
                    else:
                        self.trace('\tcurrent player should roll again')
                else:
                    self.trace('\tplayer',self.player, 'wins')
        
        elif action.type == ActionType.NO_MOVES_AVAILABLE:

            # Reset
            self.available_moves = None
            self.dice = None

            self.trace('\tplayer', self.player, 'can\'t move')
            self.goto_next_player()
            self.trace('\tselected next player', self.player)


        #
        # Unknown
        #
        else:
            self.trace('Could not execute Action', vars(action))
            return False

        return True

#
# Test drive
#
if __name__ == "__main__":
    game = GameOfUr(debug=False, player=0)
    print( '', *game.get_board_as_tiles(), sep='\n' )

    
    
    for i in range(100):
        outboundAction = game.negotiate_next_action()
        if outboundAction.type != ActionType.UNKNOWN_ACTION:
            inboundAction = game.choose(outboundAction, choice='LAST')
            game.exec(inboundAction)

            #if outboundAction.type == ActionType.MOVE:
            print( '', *game.get_board_as_tiles(), sep='\n' )
                #print(vars(game))
            if game.get_winner() != None:
                print('\nGame won by player', game.get_winner(), 'in',i,'steps.')
        