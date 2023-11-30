import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js'
import screenfull from 'screenfull';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DiceGroup } from './DiceGroup';
import { Board } from './Board';
import { Chip } from './Chip';
import { Lights } from './Lights';
import { debounce, remove } from 'lodash';
import { ChipStack } from './ChipStack';
import { Tile } from './Tile';
import {  API } from './API';
import { ActionTypes } from './models';


class GameOfUr {

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
                color: 0xbbbbbb,
                emissive: 0x220044,
                shininess: 300,
                reflectivity: 100
            })
        );
        plane.geometry.rotateX(Math.PI * 1.5)
        plane.receiveShadow = true
        scene.add(plane)

        /** Board */
        const board = new Board()
        board.position.set(-10, 0, 0)
        scene.add(board)

        /* Dice */
        const dice = new DiceGroup()
        scene.add(dice)
        dice.position.set(45, 0, 0)
        dice.rotateY(Math.PI * 0.5)


        /** Construct lights after possible target content  */
        const lights = new Lights({ dice, board })
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

        /** Public  */
        this.public({ dice, scene, camera, board, lights })

    }



    /** Delayed responses */
    computerMoveDelay= 500
    _timeouts = []
    get timeouts(){
        return this._timeouts
    }
    set timeouts(timeouts){
        this._timeouts.forEach( timeout => {
            clearTimeout(timeout)
        })
        this._timeouts = timeouts
    }


    onData(data) {


        if (!data) {
            this.api.create()
            return;
        }

        this.interactiveObjectsOnce = []
        this.timeouts = []
        

        const { board, action, dice, player } = data

        /** Update the board */
        board.forEach((row, y) => {
            row.forEach((tile, x) => {
                const [tileType, player, chips] = tile;
                if (tileType === 'START' || tileType === 'END') {
                    const stack = this.board.stacks[(y === 0 ? 0 : 2) + (tileType === 'END' ? 1 : 0)]
                    stack.init(chips)
                } else {
                    const chip = this.board.grid[y][x].chip
                    if (chips && !chip) {
                        const chip = new Chip(this.board.chipWidth, this.board.chipHeight, this.board.colors[player])
                        chip.moveToTile(this.board, x, y)
                    } else if (!chips && chip) {
                        chip.unregister()
                        chip.parent.remove(chip)
                    }
                }
            })
        })

        /** Update dice */
        if (dice) this.dice.roll(null, dice, 0, 0)

        const { type, options, agent } = action
        
        //console.log(action, data)

        switch (type) {
            case 'SELECT_PLAYER':
                this.api.action(type, 'RAND')
                break;
            case 'ROLL_DICE':

                const act = () => this.dice.roll(
                    value => this.api.action(type, value)
                )

                if (agent === "COMPUTER") {
                    this._timeouts.push(
                        setTimeout(act, this.computerMoveDelay)
                    )
                } else {
                    this.once(this.dice, act)
                }

                break;
            case 'MOVE':


                /** Stack from coords */
                const s = (x, y) => {
                    return (x === 4 || x === 5) && y !== 1 ? this.board.stacks[(y === 0 ? 0 : 2) + (x === 4 ? 0 : 1)] : undefined;
                }
                /** Chip from coords */
                const c = (x, y) => this.board.grid[y][x]?.chip

                /** Tile from coords */
                const t = (x, y) => this.board.grid[y][x]?.tile

                /** Chip or stack from coords */
                const cos = (x, y) => s(x, y) || c(x, y);

                /** Tile or stack from coords */
                const tos = (x, y) => s(x, y) || t(x, y)

                const getActionFn = opt => {

                    const [, [tx, ty]] = opt;
                    const to = tos(tx, ty),
                        enemy = c(tx, ty)

                    return (object) => {

                        const chip = object instanceof ChipStack ? object.getRandomChip() : object;
                        const onComplete = () => this.api.action(type, opt)
                        //console.log(fx,fy,tx,ty, 'chip:',chip.constructor.name, 'to:', to )

                        if (enemy) {
                            enemy.moveToStack(this.board.stacks[((player + 1) % 2) * 2], true, onComplete, true)
                        }
                        if (to instanceof ChipStack) {
                            chip.moveToStack(to, true, !enemy && onComplete)
                        } else if (to instanceof Tile) {
                            chip.moveToTile(this.board, tx, ty, true, !enemy && onComplete)
                        }
                        this.interactiveObjectsOnce = []
                    }

                }
                let actionFn;
                if (agent === 'COMPUTER') {
                    const best = this.api.action(ActionTypes.SELECT_BEST_MOVE, options)
                    const [[fx, fy]] = best;
                    actionFn = () => {
                        const obj = cos(fx, fy)
                        getActionFn(best)(obj)
                    }
                    this._timeouts.push(
                        setTimeout(actionFn, this.computerMoveDelay)
                    )
                } else {
                    options.forEach((opt) => {
                        const [[fx, fy]] = opt;
                        const from = cos(fx, fy),
                            actionFn = getActionFn(opt)
                        this.once(from, actionFn)
                    })
                }

                break;
            case 'NO_MOVES_AVAILABLE':
                if (agent === "COMPUTER") {
                    this._timeouts.push(
                        setTimeout(() => this.api.action(type), this.computerMoveDelay)
                    )
                } else {
                    this.api.action(type);
                }

                break;
            default:
                console.log('unhandled action', action)

                break;
        }


    }


    animationsRunning
    setAnimationsRunning(animationsRunning) {
        if (animationsRunning !== this.animationsRunning) {
            this.animationsRunning = animationsRunning;
            //console.log({animationsRunning})
        }
    }
    update(time) {

        /** Request next frame */
        this.animationFrame = requestAnimationFrame((time) => this.update());

        try {
            /** Render */
            this.renderer.render(this.scene, this.camera);

            /** Update stuff */
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
            this.onPointerMove,
            this.onData,
            this.once
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
        document.addEventListener('pointerdown', this.onPointerMove);
        document.addEventListener('click', this.onPointerDown);
        document.addEventListener('tap', this.onPointerDown);

        /** Create and init API*/
        this.api = new API(this.onData);
        this.api.init();





        /** Start the renderloop */
        this.update()

    }


    /** Store & handle interactive objects */
    _interactiveObjectsOnce = []
    get interactiveObjectsOnce() {
        return this._interactiveObjectsOnce
    }
    set interactiveObjectsOnce(objects) {
        this._interactiveObjectsOnce = objects
        //console.log('_interactiveObjectsOnce', this._interactiveObjectsOnce.length)
        this.updateInteractionLights()
    }
    once(object, handler) {
        this.interactiveObjectsOnce = [...this.interactiveObjectsOnce, { object, handler }]
        this.updateInteractionLights()
    }
    updateInteractionLights = debounce(() => {
        this.lights.updateSpots(this.interactiveObjectsOnce.map(({ object }) => object))
    }, 50)

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
            this.interactiveObjectsOnce.map(({ object }) => object)
        )

        /** Show as clickable */
        this.container.style.cursor = this.objectsUnderPoint.length ? 'pointer' : 'auto'
    }

    /** Handle user click */
    onPointerDown(event) {
        const self = this;
        this.objectsUnderPoint.forEach((intersect) => {
            const { object } = intersect;
            /** Remove eventlistener and exec */
            remove(self.interactiveObjectsOnce, (node) => {
                return node.object === object || node.object.children.includes(object)
            }).forEach(({ handler }) => {
                handler(object)
            })



        });
        this.onPointerMove(event)
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
        this.interactiveObjectsOnce = []
        window.removeEventListener('resize', this.onWindowResize)
        document.removeEventListener('pointerdown', this.onPointerMove);
        document.removeEventListener('pointermove', this.onPointerMove);
        document.removeEventListener('click', this.onPointerDown);
        document.removeEventListener('tap', this.onPointerDown);

        /** Dispose renderer and cleanup DOM */
        if (this.renderer) {
            this.container.removeChild(this.renderer.domElement)
            this.renderer.dispose()
        }
    }

    toggleFullScreen() {
        screenfull.toggle(this.container)
    }
}



export {GameOfUr}
