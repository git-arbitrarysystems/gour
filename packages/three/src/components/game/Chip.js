import * as THREE from 'three'
import { ADDITION, Brush, Evaluator } from 'three-bvh-csg';
class Chip extends THREE.Mesh{
    constructor(radius = 1.5, height = 1.5, color = 0x00bb88){

        
        

        const material = new THREE.MeshPhongMaterial({
            color,
            //wireframe:true
        })

        
        const cylinderGeometry = new THREE.CylinderGeometry(radius, radius, height)
        const torusGeometry = new THREE.TorusGeometry(radius, height * 0.5)
        torusGeometry.rotateX(Math.PI * 0.5)

        const cylinderBrush = new Brush(cylinderGeometry);
        cylinderBrush.translateY(height*0.5)
        cylinderBrush.updateMatrixWorld()

        const torusBrush = new Brush(torusGeometry)
        torusBrush.translateY(height*0.5)
        torusBrush.updateMatrixWorld()

        /** Calculate geometry */
        const evaluator = new Evaluator();
        const { geometry: chipGeometry } = evaluator.evaluate(cylinderBrush, torusBrush, ADDITION);
        

        /** Create and add frame */
        super(chipGeometry, material)
        
        this.castShadow = true;
        this.receiveShadow = true


    }
}

export {Chip}