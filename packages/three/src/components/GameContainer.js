import { Box } from "@mui/material"
import { useRef, useEffect } from "react"
import Main from "./game/Main";

const GameContainer = props => {
    const ref = useRef()
    
    useEffect(() => {
        /** Dom target */
        const container = ref.current;

        /** New Game */
        const game = new Main(container)
        window.game = game;
        game.start()

        /** Cleanup */
        return () => game.stop()
    }, []);

    return <Box ref={ref} />
}

export default GameContainer