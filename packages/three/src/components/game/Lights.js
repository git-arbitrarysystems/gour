import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'

class Lights extends THREE.Group {
    constructor(targets) {
        super()

        const { dice, board } = targets;

        /** Ambient Light */
        // const ambient = new THREE.AmbientLight(0xffffff, .05)
        // this.add(ambient)

        /** Directional Light */
        this.mainDirectionalLight = new THREE.DirectionalLight(this.randomColor(), .125);
        this.mainDirectionalLight.position.set(30, 100, 30);
        this.add(this.mainDirectionalLight)

        Lights.castShadow(this.mainDirectionalLight, true)
        Lights.debug(this.mainDirectionalLight, false)


        /** */
        this.mainSpot = new THREE.SpotLight(
            this.randomColor(), 5, 200,
            Math.PI*0.1, 0.5, 0
        )
        this.mainSpot.position.set(
            dice.position.x-120, 
            70, 
            dice.position.z+100
        )
        this.mainSpot.target = dice
        this.add(this.mainSpot)

        Lights.castShadow(this.mainSpot, true)
        Lights.debug(this.mainSpot, false)

        /** */
        this.secondarySpot = new THREE.SpotLight(
            this.randomColor(), 5, 200,
            Math.PI*0.1, 0.25, 0
        )
        this.secondarySpot.position.set(
            board.position.x+120, 
            50, 
            board.position.z-80
        )
        this.secondarySpot.target = board
        this.add(this.secondarySpot)

        Lights.castShadow(this.secondarySpot, true)
        Lights.debug(this.secondarySpot, false)


        /** */
        this.tertiarySpot = new THREE.SpotLight(
            this.randomColor(), 5, 200,
            Math.PI*0.1, 0.25, 0
        )
        this.tertiarySpot.position.set(
            board.position.x-120, 
            50, 
            board.position.z0
        )
        this.tertiarySpot.target = board
        this.add(this.tertiarySpot)

        Lights.castShadow(this.tertiarySpot, true)
        Lights.debug(this.tertiarySpot, false)


            
    }

    randomColor(){
        const color = new THREE.Color();
        color.setHSL(Math.random(), 1,0.5)
        return color
    }

    update() {
        //this.mainDirectionalLight?.helper?.update()
        //this.mainSpot?.helper?.update()
        
    }

    spots = []
    updateSpots(targets){
        
        const lowIntensity = 0,
            fullIntensity = 6,
            distance = 50

        while( this.spots.length < targets.length ){

            const color = this.randomColor()

            const spot = new THREE.SpotLight(
                color, lowIntensity, 270,
                Math.PI*0.01, 0.5, 0.1
            )
            spot.position.set(0,distance, distance)
            spot.target = new THREE.Object3D()
            
            this.add(spot.target)
            this.add(spot)
            this.spots.push(spot)
            
            Lights.castShadow(spot, true) 
            Lights.debug(spot, false )
        }

        

        this.spots.forEach( (spot, index) => {
            const target = targets[index]

            /** Current position and angle and intensity */
            const {x,y,z} = spot.target.position
            const {x:px,y:py,z:pz} = spot.position
            const a = spot.angle
            const i = spot.intensity

            /** Current color in hsl */
            var hsl = {};
            new THREE.Color(spot.color.r, spot.color.g, spot.color.b).getHSL(hsl);

            const from = {x,y,z,a,i, px, py, pz, ...hsl},
                to = {
                    ...from, 
                    i:lowIntensity,
                    px:distance * Math.sin(index/this.spots.length * Math.PI * 2 ),
                    py:distance,
                    pz:distance * Math.cos(index/this.spots.length * Math.PI * 2 ),
                    h:Math.random()
                }

            if( target && target.parent ){

                /** Get target position */
                const {x:tx,y:ty,z:tz} = this.worldToLocal(
                    target.parent.localToWorld( new THREE.Vector3(target.position.x, target.position.y, target.position.z) )
                )
                
                /** Calculate target angle */
                const bb = new THREE.Box3().setFromObject(target),
                r = Math.sqrt(
                    Math.pow( bb.max.x - bb.min.x, 2 ) + 
                    Math.pow(bb.max.z - bb.min.z, 2)
                ) * 0.5,
                d = target.position.distanceTo( spot.position );
                
                to.x = tx;
                to.y = ty;
                to.z = tz;
                to.a = Math.asin(r*2/d);
                to.i = fullIntensity;
                

               

            }

            new TWEEN.Tween(from)
            .to(to, 1000)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate( ({x,y,z,a, i, px, py, pz, h, s, l}) => {
                spot.position.set(px, py, pz)
                spot.target.position.set(x,y,z)
                spot.angle = a
                spot.intensity = i
                spot.color.setHSL(h,s,l)
            })
            .start()
        })

       



    }
}

Lights.castShadow = (light, bool) => {
    light.castShadow = bool
    light.shadow.camera.top = -75;
    light.shadow.camera.bottom = 75;
    light.shadow.camera.left = -75;
    light.shadow.camera.right = 75;
    light.shadow.camera.near = 5;
    light.shadow.camera.far = 200;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
}

Lights.debug = (light, bool) => {
    /** Debug light settings */
    if (!light.helper) {
        light.helper = new THREE.CameraHelper(light.shadow.camera)
        light.parent.add(light.helper)
    }
    light.helper.visible = bool
}

export { Lights }