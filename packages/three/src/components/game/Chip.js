import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three'
import { ADDITION, Brush, Evaluator } from 'three-bvh-csg';
class Chip extends THREE.Mesh {
    constructor(radius = 1.5, height = 1.5, color = 0x00bb88) {

        const material = new THREE.MeshPhongMaterial({
            color,
            //wireframe:true
        })


        const cylinderGeometry = new THREE.CylinderGeometry(radius, radius, height)
        const torusGeometry = new THREE.TorusGeometry(radius, height * 0.5)
        torusGeometry.rotateX(Math.PI * 0.5)

        const cylinderBrush = new Brush(cylinderGeometry);
        cylinderBrush.translateY(height * 0.5)
        cylinderBrush.updateMatrixWorld()

        const torusBrush = new Brush(torusGeometry)
        torusBrush.translateY(height * 0.5)
        torusBrush.updateMatrixWorld()

        /** Calculate geometry */
        const evaluator = new Evaluator();
        const { geometry: chipGeometry } = evaluator.evaluate(cylinderBrush, torusBrush, ADDITION);


        /** Create and add frame */
        super(chipGeometry, material)

        this.jumpHeight = 10;
        this.castShadow = true;
        this.receiveShadow = true


    }

    moveToSpace(space) {

        /** Current position in target space */
        const current = this.parent ? space.worldToLocal(
            this.parent.localToWorld(this.position)
        ) : { x: 0, y: 0, z: 0 }

        space.add(this)
        this.position.set(current.x, current.y, current.z)
        return current

    }

    moveToStack(stack, animated = false) {
        const target = stack.registerChip(this)
        if( !target ){
            console.warn('Illegal move')
            return;
        }

        const current = this.moveToSpace(stack)
        if (animated) {
            this.animate(current, target)
        } else {
            this.position.set(target.x, target.y, target.z)
        }

    }

    moveToTile(board, x, y, animated = false) {
        const target = board.registerChip(this, x, y)
        if( !target ){
            console.warn('Illegal move')
            return;
        }
        const current = this.moveToSpace(board)
        if (animated) {
            this.animate(current, target)
        } else {
            this.position.set(target.x, target.y, target.z)
        }
    }

    update(x, y, z) {
        this.position.set(
            x === undefined ? this.position.x : x,
            y === undefined ? this.position.y : y,
            z === undefined ? this.position.z : z,
        )
    }

    animate(from, to, duration = 300) {

        /** Move */
        new TWEEN.Tween(from)
            .to(to, duration)
            .onUpdate(({ x, y, z }) => this.update(x, y, z))
            .start()

        /** Jump */
        const jump = { y: (from.y + to.y) * 0.5 + this.jumpHeight }

        new TWEEN.Tween({ y: from.y })
            .to(jump, duration * 0.5)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(({ x, y, z }) => this.update(x, y, z))
            .chain(
                new TWEEN.Tween(jump)
                    .to({ y: to.y }, duration * 0.5)
                    .easing(TWEEN.Easing.Cubic.In)
                    .onUpdate(({ x, y, z }) => this.update(x, y, z))
            )
            .start()



    }


}

export { Chip }