import * as THREE from 'three';

import { useEffect, useRef, useState } from "react";
import { Box } from '@mui/material';

const Tetrahedron = props => {

    const ref = useRef(null);

    const getTexture = (options = {}) => {

        /** Common CanvasTexture Renderer */
        options = {
            ...({
                type: 'dicetexture',
                width: 200,
                height: 200,
                tipSize: 50,
                tipColor: 'red',
                appendPreviewCanvas: true
            }), ...options
        }

        const id = JSON.stringify(options)
        let canvas = document.getElementById(id)
        if (canvas) return canvas;

        if (options.appendPreviewCanvas) {
            canvas = document.createElement("canvas")
            canvas.id = id
            document.body.appendChild(canvas)
        } else {
            canvas = new OffscreenCanvas(options.width, options.height)
            canvas.id = id
        }

        console.log(canvas)

        /** Specific implementations */
        const { width: w, height: h, tipSize, drawLeftTip, drawRightTip, drawTopTip, tipColor } = options
        canvas.width = w
        canvas.height = h

        const ctx = canvas.getContext('2d')
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, w, h)


        ctx.fillStyle = 'red'
        if (drawTopTip) ctx.fillRect(0, 0, w, tipSize)

        if (drawLeftTip) {
            ctx.beginPath()
            ctx.moveTo(0, h)
            ctx.lineTo(tipSize, h)
            ctx.lineTo(0, h - tipSize)
            ctx.closePath()
            ctx.fill()
        }
        if (drawRightTip) {
            ctx.beginPath()
            ctx.moveTo(w, h)
            ctx.lineTo(w - tipSize, h)
            ctx.lineTo(w, h - tipSize)
            ctx.closePath()
            ctx.fill()
        }


        return canvas

    }


    useEffect(() => {

        const width = 200
        const height = 200;

        /** Create renderer */
        const renderer = new THREE.WebGLRenderer({ alpha: false });
        renderer.setSize(width, height);

        /** Empty the dom-container */
        while (ref.current?.firstChild) ref.current.removeChild(ref.current.firstChild)
        ref.current && ref.current.appendChild(renderer.domElement);

        /** Scenes and cameras */
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, -1, 1, -1, 1)
        scene.add(camera)

        /** */
        const group = new THREE.Group()
        scene.add(group)

        /** Construct Tetrahedron */
        var geometry = new THREE.TetrahedronGeometry(1);

        /** Make it sit on the plane */
        geometry.applyMatrix4(
            new THREE.Matrix4().makeRotationAxis(
                new THREE.Vector3(1, 0, 1).normalize(),
                Math.atan(Math.sqrt(2))
            )
        );
        geometry.translate(0, 1 / 3, 0);


        geometry.addGroup(0, 3, 0);
        geometry.addGroup(3, 3, 1);
        geometry.addGroup(6, 3, 2);
        geometry.addGroup(9, 3, 3);
        geometry.setAttribute("uv", new THREE.Float32BufferAttribute([ // UVs, 
            //numbers here are to describe uv coordinate, so they are actually customizable
            // if you want to customize it, you have to check the vertices position array first. 
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
       

        /** Add a debug material */
        const wireframe = new THREE.LineSegments(
            new THREE.EdgesGeometry(geometry),
            new THREE.LineBasicMaterial({
                color: 0x00ff00,
                linewidth: 1
            })
        )


       

        const shape = new THREE.Mesh(
            geometry,
            Array(4).fill().map((n, i) => new THREE.MeshBasicMaterial({
                map: new THREE.CanvasTexture(
                    getTexture({ drawTopTip: true, drawLeftTip: i === 1, drawRightTip: i === 0 })
                ),
                side: THREE.DoubleSide,
                //transparent: true, opacity: 0.8
            })
            )
        )



        var light1 = new THREE.PointLight(0xffffff, 1, 0);
        light1.position.set(-1, 5, -7);
        scene.add(light1);






        group.add(shape)
        group.add(wireframe)



        window.setTargetRotation = ([x, y, z]) => {
            group.targetRotation = [x * Math.PI, y * Math.PI, z * Math.PI]
        }

        window.geometry = geometry

        // 0: [0.1,0,0.25]
        // 1: [0.6,0.75,0] // var o = 0.1; setTargetRotation([0.6,0.75+o,0+-o]) (o>0)

        var animate = function () {
            requestAnimationFrame(animate);
            if (group.targetRotation) {
                const speed = 0.1
                const [tx, ty, tz] = group.targetRotation
                const [x, y, z] = group.rotation;
                group.rotation.x = x <= tx - speed ? group.rotation.x + speed : x >= tx + speed ? group.rotation.x - speed : tx;
                group.rotation.y = y <= ty - speed ? group.rotation.y + speed : y >= ty + speed ? group.rotation.y - speed : ty;
                group.rotation.z = z <= tz - speed ? group.rotation.z + speed : z >= tz + speed ? group.rotation.z - speed : tz;
            }

            renderer.render(scene, camera);
        };
        animate();
    }, []);





    return (
        <Box sx={{}} ref={ref}></Box>

    );
}

export default Tetrahedron