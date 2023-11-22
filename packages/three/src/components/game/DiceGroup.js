import * as THREE from 'three'
import { Dice } from './Dice';

/** 
 * 
 * Group of 4 dice
 * 
 * */
class DiceGroup extends THREE.Mesh {
    constructor(size = 6) {

        /** Define gridsize by radius of tetrahedron */
        const gridSize = (size * 2) * 0.8;

        /** Define the interactive floor as a Box */
        super(
            new THREE.BoxGeometry(gridSize * 2.5, 0, gridSize * 2), 
            new THREE.MeshBasicMaterial({ wireframe: true, visible:false })
        )

        /** Create 4 dice */
        this.array = Array(4).fill().map((n, i) => {
            const dice = new Dice(size);
            const offset = (Math.floor(i / 2) % 2) * 0.5;
            const x = (i % 2 + offset - 0.75) * gridSize,
                y = size / 3,
                z = (Math.floor(i / 2) - 0.5) * gridSize;
            dice.position.set(x, y, z)
            this.add(dice)
            return dice
        })


    }

    /** Roll all four dice */
    roll(values = [], duration) {
        this.array.forEach((dice, i) => {
            dice.roll(
                values[i] || Math.round(Math.random()),
                typeof duration === 'number' ? duration : 600 + Math.round(Math.random() * 200),
                3 + Math.random() * 2
            )
        })

    }
}

export { DiceGroup }