import { Box } from "@mui/material"
import { useRef, useEffect, useState } from "react"
import {Main} from "gour";
import { UI } from "./UI";

const GameContainer = props => {
    const ref = useRef()
    const [game, setGame] = useState()


    useEffect(() => {
        /** Dom target */
        const container = ref.current;

        /** New Game */
        const game = new Main(container)
        window.game = game;
        game.start()

        /**  */
        setGame(game);

        /** Cleanup */
        return () => {
            game.stop()
            setGame()
        }
    }, []);

    return <Box sx={{ position: 'fixed', left: 0, top: 0, width: '100%', height: '100%' }}>
        <Box ref={ref} />
        <UI game={game} />
    </Box>
}

export default GameContainer