import FullscreenIcon from "@mui/icons-material/Fullscreen"
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Box,  IconButton } from "@mui/material"
import { useState } from "react";
import screenfull from 'screenfull';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const positionAbsolute = { position: 'absolute', left: 0, top: 0, bottom: 0, right: 0 }
const eventsPassThrough = { pointerEvents: 'none', '& > *': { pointerEvents: 'auto' } }
const iconButton = { color: '#fff', opacity: 0.5, '&:hover': { opacity: 1, transition: 'opacity 0.25s' } }

const UI = props => {
    const { game } = props;

    const [isFullscreen, setIsFullscreen] = useState(false)
    if (screenfull.isEnabled) {
        screenfull.on('change', () => {
            setIsFullscreen(screenfull.isFullscreen);
        });
    }


    return <Box sx={{ ...positionAbsolute, ...eventsPassThrough }}>
        <Box sx={{ display: 'flex', p: 1, ...eventsPassThrough }}>


            <IconButton title="Start a new game" size="small" sx={{ ...iconButton, ml: 'auto' }} onClick={() => {
                const userResponse = window.confirm('This will delete the current game. Are you sure?')
                if (userResponse) game?.api.delete()
            }}>
                <DeleteForeverIcon />
            </IconButton>

            {screenfull.isEnabled &&
                <IconButton title="Toggle fullscreen" size="small" sx={{ ...iconButton }} onClick={() => screenfull.toggle(document.body)}>
                    {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                </IconButton>
            }
        </Box>
    </Box>
}

export { UI }