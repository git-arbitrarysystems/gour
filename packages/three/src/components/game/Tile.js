import * as THREE from 'three'

import { SUBTRACTION, Brush, Evaluator } from 'three-bvh-csg';

class Tile extends THREE.Group {
    constructor(size = 20.0) {

        super()

        /** Settings */
        const border = 0.15;
        const height = 0.05;
        const insetHeight = height * 0.5;

        /** Material */
        const material = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            //wireframe: true,
            side: THREE.DoubleSide
        })


        /** Frame */
        const outerGeometry = new THREE.BoxGeometry(1, height, 1),
            innerGeometry = new THREE.BoxGeometry(1 - border * 2, height, 1 - border * 2);

        const innerBrush = new Brush(innerGeometry);
        innerBrush.translateY(height-insetHeight)
        innerBrush.updateMatrixWorld()

        const outerBrush = new Brush(outerGeometry)
        outerBrush.updateMatrixWorld()



        /** Calculate geometry */
        const evaluator = new Evaluator();
        const { geometry: frameGeometry } = evaluator.evaluate(outerBrush, innerBrush, SUBTRACTION);

        /** Create and add frame */
        const frame = new THREE.Mesh(frameGeometry, material)
        frame.translateY(height*0.5)

        frame.castShadow = true;
        frame.receiveShadow = true
        this.add(frame)



        this.scale.set(size, size, size)





    }
}

export { Tile }