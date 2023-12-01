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

const AI_Scores = {

    FROM_DOUBLE:10, /** Leaving a double */
    TO_DOUBLE:20, /** Arriving at a double */
    
    FROM_CENTER:-40, /** Leaving the center double */
    TO_CENTER:40, /** Arriving at the center double */

    FROM_SAFE:-5, /** Leaving the safe area */
    TO_SAFE:10, /** Getting to the safe area */
    
    HIT:25, /** Taking out an opponent */
    HIT_LATE:25, /** Taking out an opponent after the center dot */
    FINISH:3, /** Reaching the destination */

    CURRENT_DANGER:20, /** React to danger currently behind me */
    FUTURE_DANGER:-10, /** Analyse danger that will be behind me */
    //CHASE:1, /** Look ahead for prey */
    
    DISTANCE:(1/16) * 5 /** Bonus for each step in the right direction */
    
} 

export {TileTypes, ActionTypes, PlayerTypes, AI_Types, AI_Scores}