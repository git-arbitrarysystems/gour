import * as THREE from 'three'
import { Spot } from './Spot'
class Lights extends THREE.Group {
    constructor(targets) {
        super()

        const { dice } = targets;

        /** Ambient Light */
        // const ambient = new THREE.AmbientLight(0xffffff, .05)
        // this.add(ambient)

        /** Directional Light */
        this.mainDirectionalLight = new THREE.DirectionalLight(0xffffcc, .25);
        this.mainDirectionalLight.position.set(30, 30, 30);
        this.add(this.mainDirectionalLight)

        Lights.castShadow(this.mainDirectionalLight, true)
        Lights.debug(this.mainDirectionalLight, false)


        /** */
        this.spot = new THREE.SpotLight(
            0xff0000, 2, 100,
            Math.PI*0.25, 0.5, 0
        )
        this.spot.position.set(dice.position.x-20, 50, dice.position.z+30)
        this.spot.target = dice
        this.add(this.spot)

        Lights.castShadow(this.spot, true)
        Lights.debug(this.spot, false)



    }

    update() {
        //this.mainDirectionalLight?.helper?.update()
        this.spot.helper?.update()
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