import * as THREE from 'three'
import { Tile } from './Tile';
import { Chip } from './Chip';
import * as  TWEEN from '@tweenjs/tween.js';

class Board extends THREE.Group {
    constructor(tileSize = 10) {
        super()

        const rows = 3, cols = 8;

        this.grid = Array(rows).fill().map(() => Array(cols))
        this.chips = []

        this.tileSize = tileSize;
        this.chipSize = tileSize * 0.15;
        this.chipHeight = tileSize * 0.15

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
                    this.grid[y][x] = tile;
                }
            }
        }


    }

    setChipOnTile(chip, x, y) {
        const tile = this.grid[y] ? this.grid[y][x] : null
        if (tile) {

            if (!chip) chip = new Chip(this.chipSize, this.chipHeight)
            chip.position.set(
                tile.position.x,
                tile.position.y + tile.baseY,
                tile.position.z
            )
            this.add(chip)
        } else {
            console.warn('No tile here', x, y)
        }
    }

    moveChipToTile(chip, x, y, duration = 300) {
        console.log('moveChipToTile', chip, x, y)
        const tile = this.grid[y] ? this.grid[y][x] : null
        if (tile && chip) {

            /** Store */
            if( this.chips.indexOf(chip) === -1 ){
                this.chips.push(chip)
            }

            /** Current position in board space */
            const current = this.worldToLocal(
                chip.parent.localToWorld(chip.position)
            )

            /** Move to boardspace */
            chip.position.set(current.x, current.y, current.z)
            this.add(chip)

            /** Linear target */
            const target = new THREE.Vector3(tile.position.x, tile.position.y + tile.baseY, tile.position.z)

            /** Intermediate Y */
            const y = (current.y + target.y) * 0.5 + 10

            /** Linear movement */
            new TWEEN.Tween(current).to(target, duration)
                .onUpdate(({ x, y, z }) => {
                    chip.position.set(x, chip.position.y, z)
                }).start()

            /** Jump */
            const updateJumpPosition = ({ y }) => chip.position.set(chip.position.x, y, chip.position.z)
            new TWEEN.Tween({ y: current.y }).to({ y }, duration * 0.5).easing(TWEEN.Easing.Cubic.Out)
                .onUpdate(updateJumpPosition).chain(
                    new TWEEN.Tween({ y }).to({ y: target.y }, duration * 0.5).onUpdate(updateJumpPosition).easing(TWEEN.Easing.Cubic.In)
                ).start()




        } else {
            console.warn('No tile here', x, y)
        }
    }



}

export { Board }