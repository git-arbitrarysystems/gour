import { Box } from "@mui/material"
import {config} from "../config";


const Chip = props => {
    const { offsetPercent, player, count, sx={} } = props;
    return <Box sx={{
        position: 'absolute',
        aspectRatio: 1,
        width: '100%',
        //height: '100%',
        borderRadius: '50%',
        borderColor: 'black',
        borderWidth: 1,
        borderStyle: 'solid',
        backgroundColor: config.colors.player[player],
        color:config.colors.player_inv[player],
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
    const offsetMultiplierPercent = Math.min( (100-widthPercent) / maxChipCount, 2 )
    if (!count) return null;

    return <Box sx={{
        position: 'absolute', left: '50%', top: '50%', paddingRight: '20px',
        transform: 'translate(-50%, -50%)', width: `${widthPercent}%`, aspectRatio: 1
    }}>
        {Array(count).fill().map((x, i) => {
            return <Chip
                key={`chip-${i}`}
                offsetPercent={((i + 1) - count * 0.5) * offsetMultiplierPercent}
                player={player}
                count={i === count - 1 && count > 1 ? count : undefined} />
        })}
    </Box>

}

const Item = props => {
    const { type, player, count, maxChipCount } = props;
    return <Box sx={{
        flexGrow: 1,
        aspectRatio: 1,
        bgcolor: type === 1 ? config.colors.board.double : type === 0 ? config.colors.board.single : 'transparent',
        position: 'relative'
    }} >
        <ChipStack player={player} count={count} maxChipCount={maxChipCount} />
    </Box>
}

const Row = props => {
    const { tiles, maxChipCount } = props;
    return <Box sx={{ display: 'flex', gap: 1 }} >
        {tiles.map((x, i) => <Item
            key={`tile${i}`}
            type={tiles[i][0]}
            player={tiles[i][1]}
            count={tiles[i][2]}
            maxChipCount={maxChipCount}
        />)}
    </Box>
}

const Board = props => {
    const { state = [[],[],[]], moves, maxChipCount = 7 } = props;
    console.log({moves})
    return <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
        <Row tiles={state[0]} maxChipCount={maxChipCount} />
        <Row tiles={state[1]} maxChipCount={maxChipCount} />
        <Row tiles={state[2]} maxChipCount={maxChipCount} />
    </Box>
}

export {Board as default, Chip}