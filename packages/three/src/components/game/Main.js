import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Dice from './Dice';
window.TWEEN = TWEEN
window.THREE = THREE

class Main {

    /** Hello dolly */
    constructor(container, width = 800, height = 500) {
        this.public({ container, width, height })
        this.init()
    }

    /** Add properies to the class instance */
    public(obj) { Object.keys(obj).forEach(key => this[key] = obj[key]) }

    /** Build */
    init() {

        const coords = {x: 0, y: 0} // Start at (0, 0)

       
	const tween = new TWEEN.Tween(coords, false) // Create a new tween that modifies 'coords'.
		.to({x: 300, y: 200}, 1000) // Move to (300, 200) in 1 second.
		.easing(TWEEN.Easing.Quadratic.InOut) // Use an easing function to make the animation smooth.
		.onUpdate((obj) => {
            console.log(obj)
			// Called after tween.js updates 'coords'.
			// Move 'box' to the position described by 'coords' with a CSS translation.
			//box.style.setProperty('transform', 'translate(' + coords.x + 'px, ' + coords.y + 'px)')
		})
		.start() // Start the tween immediately.

        /** Scene */
        const scene = new THREE.Scene();

        /** Plane */
        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100),
            new THREE.MeshPhongMaterial({
                color: 0x00ff00,
                shininess: 0,
            }));
        plane.geometry.rotateX(Math.PI * 1.5)
        plane.receiveShadow = true

        /** Ambient Light */
        const ambient = new THREE.AmbientLight(0xffffff, 0.1)

        /** Directional Light */
        const light = new THREE.DirectionalLight(0xffffff, 0.5);
        light.position.set(50, 50, 50);
        light.castShadow = true
        light.shadow.camera.top = -75;
        light.shadow.camera.bottom = 75;
        light.shadow.camera.left = -75;
        light.shadow.camera.right = 75;
        light.shadow.camera.near = -20;
        light.shadow.camera.far = 200;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;

        /** Debug light settings */
        const lightHelper = new THREE.CameraHelper(light.shadow.camera)

        /* Dice */
        const dice = new Dice()
        dice.position.set(20,10/3,20)
        window.d = dice
        scene.add(dice)

        /** Stack */
        scene.add(plane)
        scene.add(ambient);
        scene.add(light);
        scene.add(lightHelper)

        /** Camera */
        const camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000)
        camera.position.set(0, 50, 100)
        camera.lookAt(plane.position)

        /** Controls */
        const controls = new OrbitControls(camera, this.container);
        controls.target = new THREE.Vector3(0, 0, 0);
        controls.zoomSpeed = 3
        controls.update();

        /** Public  */
        this.public({ dice, scene, camera })
    }


    update(time) {

       
        /** Request next frame */
        this.animationFrame = requestAnimationFrame((time) => this.update(time));

        try {
            /** Render */
            this.renderer.render(this.scene, this.camera);

            /** Update stuff */
            TWEEN.update()
        } catch (e) {
            this.stop();
            throw (e)
        }
    }

    /** */
    start() {

        /** Safety catch */
        this.stop()

        /** Create renderer */
        this.renderer = new THREE.WebGLRenderer({ alpha: false });
        this.renderer.setSize(this.width, this.height);
        this.renderer.shadowMap.enabled = true;

        /** Add to DOM */
        this.container.appendChild(this.renderer.domElement)

        /** Start gameloop */
        this.update()


    }

    /** */
    stop() {

        /** Stop rendering */
        cancelAnimationFrame(this.animationFrame)

        /** Dispose renderer and cleanup DOM */
        if (this.renderer) {
            this.container.removeChild(this.renderer.domElement)
            this.renderer.dispose()
        }
    }
}



export default Main
