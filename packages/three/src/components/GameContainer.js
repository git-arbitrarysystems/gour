import { Box, Button } from "@mui/material"
import { useRef, useEffect, useState } from "react"
import Main from "./game/Main";

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
        <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, right: 0, pointerEvents: 'none', '& > *': { pointerEvents: 'auto' } }}>
            <Button variant="text" sx={{ color: '#fff9', position: 'absolute', left: '50%', top: 0, transform: 'translate(-50%,0)' }} onClick={() => game?.api.delete()} >
                new game
            </Button>
        </Box>
    </Box>
}

export default GameContainer