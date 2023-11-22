import * as THREE from 'three'
import { Chip } from './Chip'

class ChipStack extends THREE.Mesh {
    constructor(chipSize, chipHeight, color, numberOfChips = 0) {
        

        const chipSpace = chipSize * 3
        const boxDepth = chipSpace * 3,
            boxWidth = chipSpace * 3.5;
        super(
            new THREE.BoxGeometry(boxWidth,0,boxDepth),
            new THREE.MeshBasicMaterial({color:0xffffff, wireframe:true, visible:false})
        )

        this.chipSpace = chipSpace
        this.chipSize = chipSize;
        this.chipHeight = chipHeight;
        this.chipColor = color;

       
        /** Register chips on a 3x3 grid */
        this.slots = Array(9).fill()
        this.init(numberOfChips)
       
    }

    init(num){
        Array(num).fill().forEach( () => {
            const chip = new Chip(this.chipSize, this.chipHeight, this.chipColor);
            chip.moveToStack(this)
        })
    }

    /** Get the coordinates for this slot */
    getSlotPosition(index){

         /** Grid coords */
         const x = (index % 3)-1
         const z = Math.floor(index / 3)-1

         return {
            x:(x + ((z % 2) * 0.5)) * this.chipSpace,
            y:0,
            z: z * this.chipSpace
         }
    }

    /** Check for any available slot */
    getRandomFreeSlotIndex() {
        
        const free = this.slots.map(
            (n, i) => n ? undefined : i
        ).filter(n => n !== undefined);
        if( free.length === 0 ){
            console.warn('No free slots.')
            return false;
        }

        return free[Math.floor(Math.random() * free.length)]
    }

    /** Register a chip to this stack and return it's intended position */
    registerChip(chip){
        const slot = this.getRandomFreeSlotIndex()
        if( slot === false ) return false;
        
        /** Unregister from previous context */
        if( chip.unregister ) chip.unregister()
        this.slots[slot] = chip;
        chip.unregister = () => this.unregisterChip(chip)

        return this.getSlotPosition(slot)
    }

    /** Unregister a chip from this stack */
    unregisterChip(chip){
        for( var i in this.slots ){
            if( this.slots[i] == chip ) this.slots[i] = undefined
        }
    }

  

   
}

export { ChipStack }