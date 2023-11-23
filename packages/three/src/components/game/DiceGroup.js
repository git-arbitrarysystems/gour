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
            new THREE.BoxGeometry(gridSize * 2.5, gridSize * 2, gridSize * 2),
            new THREE.MeshBasicMaterial({ wireframe: true, visible: false })
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
    roll(onComplete, values = [], duration = 800, variation = 200) {
        values = this.array.map((dice, i) => {
            const value = typeof values[i] === 'number' ? values[i] : Math.round(Math.random())
            dice.roll(
                value,
                duration - Math.round(Math.random() * variation),
                3 + Math.random() * 2
            )
            return value
        })

        if (onComplete) setTimeout(() => {
            onComplete(values)
        }, duration)

    }
}

export { DiceGroup }