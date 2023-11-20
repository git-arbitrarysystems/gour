import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {Dice,DiceGroup} from './Dice';
window.THREE = THREE

class Main {

    /** Hello dolly */
    constructor(container) {
        this.public({ container })
        this.init()
    }

    /** Add properies to the class instance */
    public(obj) { Object.keys(obj).forEach(key => this[key] = obj[key]) }

    /** Bind some functions */
    bind(arr) { arr.forEach(fn => this[fn.name] = this[fn.name].bind(this)) }

    

    /** Build */
    init() {

        /** Scene */
        const scene = new THREE.Scene();

        /** Plane */
        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100),
            new THREE.MeshPhongMaterial({
                color: 0xffbbff,
                //shininess: true,
            }));
        plane.geometry.rotateX(Math.PI * 1.5)
        plane.receiveShadow = true

        /** Ambient Light */
        const ambient = new THREE.AmbientLight(0xffffff, 1)

        /** Directional Light */
        const light = new THREE.DirectionalLight(0xffffff, 1.5);
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
        const dice = new DiceGroup()
        dice.roll(undefined,0 )
        scene.add(dice)
       

        /** Stack */
        scene.add(plane)
        scene.add(ambient);
        scene.add(light);
        //scene.add(lightHelper)

        /** Camera */
        const camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000)
        camera.position.set(0, 50, 100)
        camera.lookAt(plane.position)

        /** Controls */
        const controls = new OrbitControls(camera, this.container);
        controls.target = new THREE.Vector3(0, 0, 0);
        controls.zoomSpeed = 3
        controls.update();

        /** Register interactive objects */
        this.appendInteractiveObjects([dice])

        /** Public  */
        this.public({ dice, scene, camera })
    }




    update(time) {

        /** Request next frame */
        this.animationFrame = requestAnimationFrame((time) => this.update());

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

        /** Binding event handlers */
        this.bind([
            this.onWindowResize,
            this.onPointerDown,
            this.onPointerMove
        ])

        /** Safety catch */
        this.stop()

        /** Create renderer */
        this.renderer = new THREE.WebGLRenderer({ alpha: false });
        this.renderer.shadowMap.enabled = true;

        /** Enable auto resize */
        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize);

        /** Add to DOM */
        this.container.appendChild(this.renderer.domElement)

        /** Game interactions */
        this.raycaster = new THREE.Raycaster()
        document.addEventListener('pointermove', this.onPointerMove);
        document.addEventListener('pointerdown', this.onPointerDown);

        /** Start the renderloop */
        this.update()

    }


    /** Store in400teractive objects */
    interactiveObjects = []
    appendInteractiveObjects(arr = []) {
        this.interactiveObjects = this.interactiveObjects.concat(
            arr.filter(e => this.interactiveObjects.indexOf(e) === -1)
        )
    }

    /** Find and store objects under cursor */
    objectsUnderPoint = []
    onPointerMove(event) {
        const pointer = {
            x: (event.clientX / window.innerWidth) * 2 - 1,
            y: -(event.clientY / window.innerHeight) * 2 + 1
        }

        /** Find objects under cursor */
        this.raycaster.setFromCamera(pointer, this.camera);
        this.objectsUnderPoint = this.raycaster.intersectObjects(
            this.interactiveObjects
        )

        /** Show as clickable */
        this.container.style.cursor = this.objectsUnderPoint.length ? 'pointer' : 'auto'
    }

    /** Handle user click */
    onPointerDown(event) {
        this.objectsUnderPoint.forEach((intersect) => {
            const {object} = intersect
            console.log('CLICK', object.constructor.name )
            if (object instanceof DiceGroup) object.roll()
        });
    }

    /** Handle window resize */
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /** */
    stop() {

        /** Stop rendering */
        cancelAnimationFrame(this.animationFrame)

        /** Stop interaction-listeners */
        window.removeEventListener('resize', this.onWindowResize)
        document.removeEventListener('pointerdown', this.onPointerDown);
        document.removeEventListener('pointermove', this.onPointerMove);

        /** Dispose renderer and cleanup DOM */
        if (this.renderer) {
            this.container.removeChild(this.renderer.domElement)
            this.renderer.dispose()
        }
    }
}



export default Main
