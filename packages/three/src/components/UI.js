import FullscreenIcon from "@mui/icons-material/Fullscreen"
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Box, Button, IconButton, Tooltip } from "@mui/material"
import { useState } from "react";
import screenfull from 'screenfull';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const positionAbsolute = { position: 'absolute', left: 0, top: 0, bottom: 0, right: 0 }
const eventsPassThrough = { pointerEvents: 'none', '& > *': { pointerEvents: 'auto' } }

const UI = props => {
    const { game, color = '#999' } = props;

    const [isFullscreen, setIsFullscreen] = useState(false)
    if (screenfull.isEnabled) {
        screenfull.on('change', () => {
            setIsFullscreen(screenfull.isFullscreen);
        });
    }


    return <Box sx={{ ...positionAbsolute, ...eventsPassThrough }}>
        <Box sx={{ display: 'flex', p: 1,...eventsPassThrough }}>

            <Tooltip arrow title="new game">
                <IconButton size="small" sx={{ color, ml: 'auto' }} onClick={() => {
                    const userResponse = window.confirm('This will delete the current game. Are you sure?')
                    if (userResponse) game?.api.delete()
                }}>
                    <DeleteForeverIcon />
                </IconButton>
            </Tooltip>
            {screenfull.isEnabled &&
                <Tooltip arrow title="toggle fullscreen">
                    <IconButton size="small" sx={{ color }} onClick={() => screenfull.toggle(document.body)}>
                        {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                    </IconButton>
                </Tooltip>
            }
        </Box>
    </Box>
}

export { UI }