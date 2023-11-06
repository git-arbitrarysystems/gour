# The Royal Game of Ur

```python
# Board
[3][2][1][0]      [13][12]
[4][5][6][7][8][9][10][11]
[ ][ ][ ][ ]      [  ][  ]

# Player
[in,out]

# Special fields (static)
DOUBLE = [3,7,13]

# Dice
[0|1,0|1,0|1,0|1]

```

### Game logic
1. SELECT_PLAYER
1. ROLL
1. MOVE
    - LAND_ON_DOUBLE ? GOTO 1 : CONTINUE
1. SELECT_NEXT_PLAYER
1. GOTO 2

### Initial state
```python
dict(
    board=[None,None,None,None,None,None,None,None,None,None,None,None,None,None],
    player=None
    dice=None
    offside=[
        [7,0],
        [7,0]
    ]
)
```

- GET /board retreive current game state
    - return full game state
- GET /action retreive next action
    - return action:"roll" roll the dice
    - return 
        - action:"move" 
        - moves:[from,to] move a chip
- POST /move [from,to] post a move
    - return action
- GET /roll
    - return 
      - value:[0-4]
      - 



