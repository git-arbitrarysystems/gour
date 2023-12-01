# Game of Ur

## AI Considerations

### Features

```js

/**
 *
 * Looking at move [sx,sy] to [tx,ty]
 *  
 */

- ENEMY (SOURCE_, TARGET_):
    - what is the values of having an enemy n steps behind/ahead. on the y axis my current index, and on the x axis the values of each position. 
    - [
        [0,0,0,0...],
        [0,0,0,0...],
        [0,0,0,0...],
        [0,0,0,0...]
        ...
    ]


- FRIEND (SOURCE_, TARGET_):
    - what is the values of having a friend n steps behind/ahead. on the y axis my current index, and on the x axis the values of each position. 
    - [
        [0,0,0,0...],
        [0,0,0,0...],
        [0,0,0,0...],
        [0,0,0,0...]
        ...
    ]

// Absolute tile values
- TILE (SOURCE_, TARGET_):
    - what is the values of having a specific tiles n steps behind/ahead. on the y axis my current index, and on the x axis the values of each position. The diagonal will reflect the intrinsic worth of this tile
    - [
        [0,0,0,0...],
        [0,0,0,0...],
        [0,0,0,0...],
        [0,0,0,0...]
        ...
    ]

```



