import { Box } from "@mui/material"
import { config } from "../config";
import AboluteBox from "./AbsoluteBox";
import { useEffect, useRef } from "react";
import updateMovesVisualisation from "../utils/updateMovesVisualisation";


const Chip = props => {
    const { offsetPercent, player, count, sx = {} } = props;
    return <Box sx={{
        overflow: 'hidden',
        position: 'absolute',
        aspectRatio: 1,
        width: '100%',
        //height: '100%',
        borderRadius: '50%',
        borderColor: 'black',
        borderWidth: 1,
        borderStyle: 'solid',
        backgroundColor: config.colors.player[player],
        color: config.colors.player_inv[player],
        transform: `translate(${offsetPercent}%, ${offsetPercent}%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx
    }} >{count}</Box>
}

const ChipStack = props => {
    const { player, count, maxChipCount } = props;
    const widthPercent = 70;
    const offsetMultiplierPercent = Math.min((100 - widthPercent) / maxChipCount, 2)
    if (!count) return null;

    return <Box
        sx={{
            position: 'absolute', left: '50%', top: '50%', paddingRight: '20px',
            transform: 'translate(-50%, -50%)', width: `${widthPercent}%`, aspectRatio: 1
        }}

    >
        {Array(count).fill().map((x, i) => {
            return <Chip
                key={`chip-${i}`}
                offsetPercent={((i + 1) - count * 0.5) * offsetMultiplierPercent}
                player={player}
                count={i === count - 1 && count > 1 ? count : undefined}
            />
        })}
    </Box>

}

const Tile = props => {
    const { type, player, count, maxChipCount, x, y } = props;

    return <Box

        sx={{
            flexGrow: 1,
            aspectRatio: 1,
            bgcolor: type === 1 ? config.colors.board.double : type === 0 ? config.colors.board.single : 'transparent',
            position: 'relative',
            overflow: 'hidden',

        }} id={`tile${x},${y}`} >
        <ChipStack
            player={player}
            count={count}
            maxChipCount={maxChipCount}


        />
    </Box>
}

const Row = props => {
    const { tiles, maxChipCount, y } = props;


    return <Box sx={{ display: 'flex', gap: 1 }} >
        {tiles.map((n, x) => <Tile
            key={`tile${x},${y}`}
            type={tiles[x][0]}
            player={tiles[x][1]}
            count={tiles[x][2]}
            x={x}
            y={y}
            maxChipCount={maxChipCount}
        />)}
    </Box>
}


const Board = props => {
    const { state = [[], [], []], moves, maxChipCount = 7, onClickTile } = props;


    const overlay = useRef()
    useEffect(() => {
        updateMovesVisualisation(
            overlay.current,
            moves,
            onClickTile
        )
    }, [overlay, moves, onClickTile])


    return <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', position: 'relative' }}>
        {Array(3).fill().map((n, y) => <Row
            key={`row-${y}`}
            tiles={state[y]}
            y={y}
            maxChipCount={maxChipCount}
        />)}
        <AboluteBox ref={overlay} id="overlay" sx={{ pointerEvents: 'none' }} />
    </Box>
}

export { Board as default, Chip }