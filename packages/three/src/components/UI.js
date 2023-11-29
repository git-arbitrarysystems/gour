import FullscreenIcon from "@mui/icons-material/Fullscreen"
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Box, Button, IconButton,  MenuItem, Select, Tooltip } from "@mui/material"
import { useEffect, useState } from "react";
import screenfull from 'screenfull';


const positionAbsolute = { position: 'absolute', left: 0, top: 0, bottom: 0, right: 0 }
const eventsPassThrough = { pointerEvents: 'none', '& > *': { pointerEvents: 'auto' } }


const UI = props => {
    const { game } = props;

    const [isFullscreen, setIsFullscreen] = useState(false)
    if (screenfull.isEnabled) {
        screenfull.on('change', () => {
            setIsFullscreen(screenfull.isFullscreen);
        });
    }






    /** format mode label */
    const modeLabel = mode => mode?.join(' vs ').toLowerCase()
    const [modeIndex, setModeIndex] = useState(0)
    useEffect( () => {
        if( game ){
            const index = game.api.modes.map( m => m.join('-')).indexOf(
                game.api.mode.join('-')
            )
            setModeIndex(index)
        }
    }, [game])
    useEffect( () => {
        if( game ){
            game.api.mode = game.api.modes[modeIndex]
        }
    }, [game, modeIndex])


    if (!game?.api) return null

    return <Box sx={{ ...positionAbsolute, ...eventsPassThrough }}>
        <Box sx={{ display: 'flex', flexWrap:'wrap', gap: {xs:1, md:2},alignItems: 'center', p: {xs:1, md:2}, ...eventsPassThrough }}>


            <Button variant="contained" onClick={() => {
                const userResponse = window.confirm('This will delete the current game. Are you sure?')
                if (userResponse) game?.api.delete()
            }}>
                new game
            </Button>

          

            <Select size="small"
                onChange={(e) => setModeIndex(e.target.value)}
                value={modeIndex}//modeLabel(game.api.mode)}
                label={modeLabel(game.api.modes[modeIndex])}
            >
                {game.api.modes.map((mode, index) => {
                    return <MenuItem
                        value={index}
                        key={`mode-${index}`}                    >
                        {modeLabel(mode)}
                    </MenuItem>
                })}
            </Select>

            <Button variant="contained" href="https://en.wikipedia.org/wiki/Royal_Game_of_Ur" target="_blank">how to play</Button>



            {screenfull.isEnabled &&
            <Tooltip title="Toggle fullscreen">
                <IconButton sx={{ml:'auto'}} onClick={() => screenfull.toggle(document.body)}>
                    {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                </IconButton>
                </Tooltip>
            }
        </Box>
    </Box>
}

export { UI }