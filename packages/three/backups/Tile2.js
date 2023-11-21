import * as THREE from 'three'

class Tile2 extends THREE.Mesh {
    constructor(size = 40.0) {

        const border = 0.2;
        const height = 0.1;
        const inset = height * 0.5;
        const vertices = new Float32Array([
            /** Border */
            0, height, 0,
            1, height, 0,
            1, height, 1,
            0, height, 1,

            /** Inset border */
            0 + border, height, 0 + border,
            1 - border, height, 0 + border,
            1 - border, height, 1 - border,
            0 + border, height, 1 - border,

            /** Inset area */
            0 + border, height - inset, 0 + border,
            1 - border, height - inset, 0 + border,
            1 - border, height - inset, 1 - border,
            0 + border, height - inset, 1 - border,

            /** Outer walls */
            0, 0, 0,
            1, 0, 0,
            1, 0, 1,
            0, 0, 1,


        ].map((n, i) => (n - (0.5 * (i % 3 === 1 ? 0 : 1))) * size)
        )

        /** Clockwise rect to triangles */
        const r2t = (a, b, c, d) => [a, b, c, c, d, a]

        const indices = [
            /** Border triangles */
            ...r2t(0, 1, 5, 4),
            ...r2t(1, 2, 6, 5),
            ...r2t(2, 3, 7, 6),
            ...r2t(3, 0, 4, 7),
            /** Inset walls */
            ...r2t(4, 5, 9, 8),
            ...r2t(5, 6, 10, 9),
            ...r2t(6, 7, 11, 10),
            ...r2t(7, 4, 8, 11),
            /** Inner base */
            ...r2t(8, 9, 10, 11),
            /** Outer walls */
            ...r2t(0, 1, 13, 12),
            ...r2t(1, 2, 14, 13),
            ...r2t(2, 3, 15, 14),
            ...r2t(3, 0, 12, 15)
        ];

        const geometry = new THREE.BufferGeometry()
        geometry.setIndex(indices);
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.computeVertexNormals()


        super(
            geometry,
            new THREE.MeshPhongMaterial({
                color: 0xff0000,
                //wireframe: true,
                side:THREE.DoubleSide
            })
        )

        this.castShadow = true;
       this.receiveShadow = true
    }
}

export { Tile2 }