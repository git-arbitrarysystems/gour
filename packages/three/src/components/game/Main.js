import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {DiceGroup} from './DiceGroup';
import { Board } from './Board';
import { Chip } from './Chip';
import { ChipStack } from './ChipStack';
import { Spot } from './Spot';
import { Lights } from './Lights';
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
            new THREE.PlaneGeometry(120, 80),
            new THREE.MeshPhongMaterial({
                color: 0xffffff,
                //emissive:0x660066,
                //shininess: 3,
                //reflectivity:100
            })
        );
        plane.geometry.rotateX(Math.PI * 1.5)
        plane.receiveShadow = true
        scene.add(plane)
       
        /** Board */
        const board = new Board()
        board.position.set(-10,0,0)
        scene.add(board)
        
         /* Dice */
         const dice = new DiceGroup()
         dice.roll(undefined,0 )
         scene.add(dice)
         dice.position.set(45,0,0)
         dice.rotateY(Math.PI * 0.5)

        
        /** Construct lights after possible target content  */
        const lights = new Lights({dice})
        scene.add(lights)



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
        this.appendInteractiveObjects([dice, board])

        /** Public  */
        this.public({ dice, scene, camera, board, lights })
    }


    animationsRunning
    setAnimationsRunning(n){
        if( n !== this.animationsRunning ){
            this.animationsRunning = n;
            console.log(this.animationsRunning)
        }
    }
    update(time) {

        /** Request next frame */
        this.animationFrame = requestAnimationFrame((time) => this.update());

        try {
            /** Render */
            this.renderer.render(this.scene, this.camera);

            /** Update stuff */
            this.lights.update()
            TWEEN.update()
            this.setAnimationsRunning(TWEEN.getAll().length)
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
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMapSoft = true;
        //this.renderer.toneMapping = THREE.CineonToneMapping 

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
            if (object instanceof DiceGroup){ 
                object.roll()
            }else if ( object instanceof Chip ){
                if( Math.random() < .5 ){
                object.moveToTile(
                    this.board,
                    Math.floor(Math.random() * 8),
                    Math.floor(Math.random() * 3),
                    true
                )
                }else{
                    object.moveToStack(
                        this.board.stacks[ Math.floor( Math.random() * this.board.stacks.length) ],
                        true
                    )
                }
            }
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
