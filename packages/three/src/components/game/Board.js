import * as THREE from 'three'
import { Tile } from './Tile';
import { Chip } from './Chip';
import { ChipStack } from './ChipStack';

class Board extends THREE.Group {
    constructor(tileSize = 10, colors=[0xffccff, 0x663300]) {
        super()

        const rows = 3, cols = 8;
        this.grid = Array(rows).fill().map(() => Array(cols).fill())

        this.colors = colors;
        this.tileSize = tileSize;
        this.chipSize = tileSize * 0.15;
        this.chipHeight = tileSize * 0.15

        /** Add tiles to the board */
        for (var y = 0; y < rows; y++) {
            for (var x = 0; x < cols; x++) {
                const enabled = y === 1 || (x < 4 || x > 5)
                const color = (y === 1 && x === 3) || (y !== 1 && (x === 0 || x === 6))
                    ? 0x555555 : 0xffffff
                if (enabled) {
                    const tile = new Tile(tileSize, 0xffffff, color)
                    tile.position.set(
                        (x + 0.5) * tileSize - (cols * 0.5 * tileSize),
                        0,
                        (y + 0.5) * tileSize - (rows * 0.5 * tileSize)
                    )
                    this.add(tile)
                    this.grid[y][x] = { tile };
                }
            }
        }

        /** Add 2 stacks of chips for each player (start, end, start, end)*/
        this.stacks = Array(4).fill().map( (n,i) => {
            const player = Math.floor(i/2);
            const type = i%2;
            const stack =  new ChipStack(this.chipSize, this.chipHeight, colors[player],0)
            const x = (-1 + type * 2) * tileSize * 2 + tileSize,
                y = 0,
                z = (-1 + player * 2) * tileSize * 2.5;
            stack.position.set(x,y,z)


            this.add(stack)
            return stack
        })

    }

    /** Register a chip for this board and return it's intended position */
    registerChip(chip, x, y){
        /** Check validity of move */
        if (!chip) {
            console.warn('You must pass a Chip')
            return false
        }

        if (!(chip instanceof Chip)) {
            console.warn(`Chip ${chip} is not of class Chip`)
            return false
        }
        if (!this.grid[y]) {
            console.warn(`Grid[${y}] doesn't exist`)
            return false
        }
        if (!this.grid[y][x]) {
            console.warn(`Grid[${y}][${x}] doesn't exist`)
            return false
        }

        const tile = this.grid[y][x].tile
        if (!tile) {
            console.warn(`Grid[${y}][${x}].tile is not a tile`)
            return false
        }
        if (this.grid[y][x].chip) {
            console.warn(`Grid[${y}][${x}] is already occupied`)
            return false
        }

        
        if( chip.unregister ) chip.unregister()
        this.grid[y][x].chip = chip;
        chip.unregister = () => this.unregisterChip(chip)

        return {
            x:tile.position.x,
            y:tile.position.y + tile.baseY,
            z:tile.position.z
        } 
    }

    unregisterChip(chip){
        this.grid.forEach( row => {
            row.forEach( col => {
                if( col && col.chip === chip ) delete col.chip
            })
        })
    }




}

export { Board }