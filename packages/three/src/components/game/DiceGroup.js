import * as THREE from 'three'
import { Dice } from './Dice';

/** 
 * 
 * Group of 4 dice
 * 
 * */
class DiceGroup extends THREE.Mesh {
    constructor(size = 6) {

        let tileWidth,
        //tileHeight,
        tileDepth;

        const array = Array(4).fill().map((n,index) => {
            const dice = new Dice(size);
            if (!tileWidth) {
                dice.geometry.computeBoundingBox()
                tileWidth = dice.geometry.boundingBox.max.x - dice.geometry.boundingBox.min.x;
                //tileHeight = dice.geometry.boundingBox.max.y - dice.geometry.boundingBox.min.y;
                tileDepth = dice.geometry.boundingBox.max.z - dice.geometry.boundingBox.min.z;
            }
            const y = Math.floor(index / 2),
                x = index % 2 + (y%2) * 0.5

            dice.position.set(x * tileWidth, size / 3, y * tileWidth)
            return dice
        })
        const boxHeight = 0;
        const geometry = new THREE.BoxGeometry(
            tileWidth*2.5,
            boxHeight, 
            tileWidth+tileDepth
        )
        geometry.translate(
            tileWidth*0.75,
            0.01 + boxHeight*0.5,
            tileDepth * 0.5
        )
        
        super(
            geometry,
            new THREE.MeshBasicMaterial({ 
                wireframe:true,
                //visible:false
            })
        )

        array.forEach(dice => this.add(dice))
        this.array = array;
    }

    roll(values = [], duration){
        this.array.forEach( (dice,i) => {
            dice.roll(
                values[i] || Math.round(Math.random()),
                typeof duration === 'number' ? duration : 600 + Math.round( Math.random() * 200 ),
                3 + Math.random() * 2
            )
        })
        
    }
}

export {DiceGroup}