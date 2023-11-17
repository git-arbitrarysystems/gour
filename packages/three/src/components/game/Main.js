import * as THREE from 'three';

class Main {
    constructor(width = 800, height=500) {
        this.width = width;
        this.height = height;
        this.init()
    }

    init() {

        /** Scenes and cameras */
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);
        this.scene.add(this.camera)

       
        

        /** Plane */
        const geometry = new THREE.PlaneGeometry(100, 100,3,3);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide, wireframe: true });
        this.plane = new THREE.Mesh(geometry, material);
        this.scene.add(this.plane)

       
    }


    update(){
        console.log('update')
        

        this.camera.position.set( new THREE.Vector3(100,100,this.camera.position.z + 0.1))
        this.camera.lookAt(this.plane.position)
    }

}

export default Main
