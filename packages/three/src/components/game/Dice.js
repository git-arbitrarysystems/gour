import * as THREE from 'three'
import * as  TWEEN from '@tweenjs/tween.js';

/** 
 * Single 4-sided dice 
 * 
 * */
class Dice extends THREE.Mesh {
    constructor(size = 10) {

        /** Construct Tetrahedron */
        var geometry = new THREE.TetrahedronGeometry(size);

        /** Normalize rotation */
        geometry.applyMatrix4(
            new THREE.Matrix4().makeRotationAxis(
                new THREE.Vector3(1, 0, -1).normalize(),
                Math.atan(Math.sqrt(2))
            )
        );

        /** Face `forward` */
        geometry.rotateY(Math.PI / 12)

        /** Create groups for an array of materials */
        geometry.addGroup(0, 3, 0);
        geometry.addGroup(3, 3, 1);
        geometry.addGroup(6, 3, 2);
        geometry.addGroup(9, 3, 3);

        /** Texture mapping per point 
         *  front, right, bottom,left
        */
        geometry.setAttribute("uv", new THREE.Float32BufferAttribute([
            0, 0,
            1, 0,
            0.5, 1,
            //
            1, 0,
            0.5, 1,
            0, 0,
            //
            1, 0,
            0.5, 1,
            0, 0,
            //
            0, 0,
            1, 0,
            0.5, 1
        ], 2));


        super(geometry,
            Array(4).fill().map((n, i) => new THREE.MeshPhongMaterial({
                map: Dice.renderCanvasTexture({
                    drawTopTip: true,
                    drawLeftTip: i === 1,
                    drawRightTip: i === 0
                }),
                //shininess:250,
                //emissive:0xffffff,
                //emissiveIntensity:0.01
                specular:0x555555
                //side: THREE.DoubleSide,
                //transparent: true, opacity: 0.8
            })
            )
        )

        this.castShadow = true;
        this.receiveShadow = true

        /** */
        this.size = size


    }




    roll(value = 0, duration = 1000, height = 3) {

        if( this.value === value && duration === 0 ) return; 
        this.value = value;

        /** Store current rotation */
        var rotationFrom = [this.rotation.x, this.rotation.y, this.rotation.z],
            rotationTo = [0, 0, 0]

        /** Calculate `to` properties */
        const temp = new THREE.Object3D()
        if (value === 0) {
            temp.rotation.set(Math.PI - Math.acos(1 / 3), 0, 0)
            temp.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), Math.PI)
        }
        temp.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), Math.PI * (Math.random()))

        rotationTo = temp.rotation.toArray().slice(0, 3)

        rotationTo[0] += (Math.PI * 2) * (Math.floor(Math.random() * 3) - 1)
        rotationTo[1] += (Math.PI * 2) * (Math.floor(Math.random() * 3) - 1)
        rotationTo[2] += (Math.PI * 2) * (Math.floor(Math.random() * 3) - 1)

        /** Create roll tween instance */
        const updateRotation = ([x, y, z]) => this.rotation.set(x, y, z)
        const rotation = new TWEEN.Tween(rotationFrom).to(rotationTo, duration).easing(TWEEN.Easing.Quadratic.Out).onUpdate(updateRotation);
        rotation.start()

        /** Jump animation*/
        const floor = this.size / 3, high = this.size * height;
        const updateTranslation = ({ y }) => this.position.set(this.position.x, y, this.position.z);

        const translationUp = new TWEEN.Tween({ y: floor }).to({ y: high }, duration * 0.5).easing(TWEEN.Easing.Cubic.Out).onUpdate(updateTranslation)
        const translationDown = new TWEEN.Tween({ y: high }).to({ y: floor }, duration * 0.5).easing(TWEEN.Easing.Quartic.In).onUpdate(updateTranslation)
        translationUp.chain(translationDown).start()



    }

}

Dice.renderCanvasTexture = function (options = {}) {
    options = {
        ...({
            width: 200,
            height: 200,
            tipSize: 50,
            tipColor: '#ffffff',
            fillColor: '#111111'
        }), ...options
    }

    /** Create a canvas */
    const canvas = new OffscreenCanvas(options.width, options.height)

    /** Specific implementations */
    const { width: w, height: h, tipSize, drawLeftTip, drawRightTip, drawTopTip, tipColor, fillColor } = options
    canvas.width = w
    canvas.height = h

    /** Background color */
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = fillColor;
    ctx.fillRect(0, 0, w, h)

    /** Top bar */
    ctx.fillStyle = tipColor
    if (drawTopTip) ctx.fillRect(0, 0, w, tipSize)


    /** Side tips */
    const tipHeight = Math.tan(Math.PI / 3) * tipSize
    if (drawLeftTip) {
        ctx.beginPath()
        ctx.moveTo(0, h)
        ctx.lineTo(tipSize, h)
        ctx.lineTo(0, h - tipHeight)
        ctx.closePath()
        ctx.fill()
    }
    if (drawRightTip) {
        ctx.beginPath()
        ctx.moveTo(w, h)
        ctx.lineTo(w - tipSize, h)
        ctx.lineTo(w, h - tipHeight)
        ctx.closePath()
        ctx.fill()
    }

    return new THREE.CanvasTexture(canvas)
}



export { Dice }