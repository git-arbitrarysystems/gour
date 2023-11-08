import { Box } from "@mui/material"

const Chip = props => {
    const { offset, player, count } = props;
    return <Box sx={{
        position: 'absolute',
        aspectRatio: 1,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        borderColor: 'black',
        borderWidth: 1,
        borderStyle: 'solid',
        backgroundColor: player === 0 ? 'white' : '#ccc',
        //color:id === 1 ? 'white' : 'black',
        transform: `translate(${offset}px, ${offset}px)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }} >{count}</Box>
}

const ChipStack = props => {
    const { chips: [player, count] } = props;
    const offsetMultiplier = 5;
    if (!count) return null;

    return <Box sx={{
        position: 'absolute', left: '50%', top: '50%', paddingRight: '20px',
        transform: 'translate(-50%, -50%)', width: `70%`, aspectRatio: 1
    }}>
        {Array(count).fill().map((x, i) => {
            return <Chip
                key={`chip-${i}`}
                offset={((i + 1) - count * 0.5) * offsetMultiplier}
                player={player}
                count={i === count - 1 && count > 1 ? count : undefined} />
        })}
    </Box>

}

const Item = props => {
    const { hide, double, chips = [] } = props;
    return <Box sx={{
        flexGrow: 1,
        aspectRatio: 1,
        bgcolor: hide ? 'transparent' : double ? '#fcc' : '#cfc',
        position: 'relative'
    }} >
        <ChipStack chips={chips} />
    </Box>
}

const Row = props => {
    const { hide = [], double = [], chips = [] } = props;
    return <Box sx={{ display: 'flex', gap: 1 }} >
        {Array(8).fill().map((x, i) => <Item
            key={`tile${i}`}
            hide={hide.includes(i)}
            double={double.includes(i)}
            chips={chips[i]}
        />)}
    </Box>
}

const Board = props => {
    const { state = [[],[],[]] } = props;
    return <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
        <Row i={0} hide={[4, 5]} double={[0, 6]} chips={state[0].map(n => [0, n])} />
        <Row i={1} double={[3]} chips={state[1].map(n => [n, typeof n === 'number' ? 1 : 0])} />
        <Row i={2} hide={[4, 5]} double={[0, 6]} chips={state[2].map(n => [1, n])} />
    </Box>
}

export default Board