
import { DiceType } from "../Dice"
import basic from "./basic"

type MapType= {
    mapData: string | (string | number | boolean)[][],
    types:object | undefined
}

type GameType = {
    board:{
        map:MapType
    }
    dice: {
        type:DiceType, /** Type of dice to use */
        num:number /** Amount of dice to use */
    },
    players:{
        count:number,
        pawns:number
    }
}

const getGameByType = (type:string):GameType | undefined => {
    /** Return specific game settings */
    return {
        basic
    }[type]
}


export {type GameType, getGameByType, type MapType}
