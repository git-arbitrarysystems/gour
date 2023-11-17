import { Box } from "@mui/material"
import { useRef, useEffect } from "react"
import * as THREE from 'three';
import Main from "./game/Main";

const GameContainer = props => {
    const ref = useRef()
    
    useEffect(() => {

        /** Dom target */
        const container = ref.current;

        /** New Game */
        const game = new Main()
        window.game = game;

        /** Create renderer */
        const renderer = new THREE.WebGLRenderer({ alpha: false });
        renderer.setSize(game.width, game.height);
        container.appendChild(renderer.domElement)
        
        /** Start rendering */
        let animationFrame
        var renderFrame = function () {

            game.update()

            animationFrame = requestAnimationFrame(renderFrame);
            renderer.render(game.scene, game.camera);
        };
        renderFrame();

        /** Cleanup */
        return () => {
            /** Stop rendering */
            cancelAnimationFrame(animationFrame)

            /** Dispose Threejs stuff */
            renderer.dispose()

            /** Empty dom */
            while( container.firstChild ) container.removeChild(container.firstChild)
            
        }
    }, []);

    return <Box ref={ref} />
}

export default GameContainer