const TileTypes = {
    NORMAL: "NORMAL",
    DOUBLE: "DOUBLE",
    START: "START",
    END: "END"
}


const ActionTypes = {
    UNKNOWN_ACTION: "UNKNOWN_ACTION",
    SELECT_PLAYER: "SELECT_PLAYER",
    ROLL_DICE: "ROLL_DICE",
    MOVE: "MOVE",
    NO_MOVES_AVAILABLE: "NO_MOVES_AVAILABLE",
    SELECT_BEST_MOVE: "SELECT_BEST_MOVE"
}

const PlayerTypes = {
    HUMAN: "HUMAN",
    COMPUTER: 'COMPUTER'
}

const AI_Types = {
    RANDOM:"RANDOM",
    SMART:"SMART"
}



export {TileTypes, ActionTypes, PlayerTypes, AI_Types}