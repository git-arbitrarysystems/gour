import * as THREE from "three";

class Spot extends THREE.SpotLight {
    constructor(color = 0xff0000, intensity = 200, distance = 80, angle = Math.PI * 0.125) {
        super(color, intensity, distance, angle)
    }
}

export { Spot }