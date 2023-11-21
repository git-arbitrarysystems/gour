import * as THREE from 'three'
import { SUBTRACTION, Brush, Evaluator } from 'three-bvh-csg';

class Tile extends THREE.Object3D {
    constructor(size = 20.0, baseColor = 0xffffff,  planeColor = 0xff0000) {

        super()

        /** Settings */
        const border = 0.15;
        const height = 0.25;
        const insetHeight = 0.1;

        this.baseY = (height - insetHeight) * size

        /** Material */
        const material = new THREE.MeshPhongMaterial({
            color:baseColor,
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

        /** Bottom Plane */
        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(1 - border * 2,1 - border * 2),
            new THREE.MeshPhongMaterial({
                color: planeColor,
                //wireframe: true,
            })
        )

        plane.geometry.rotateX(-0.5*Math.PI)
        plane.translateY(height-insetHeight+0.0001)
        plane.receiveShadow = true
        this.add(plane)


        this.scale.set(size, size, size)





    }
}

export { Tile }