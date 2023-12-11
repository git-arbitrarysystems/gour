
import { DiceType } from "../Dice"
import basic from "./basic"



type GameType = {
    players: number,
    tiles: number,
    dice: {
        type:DiceType, /** Type of dice to use */
        num:number /** Amount of dice to use */
    },
    pawns: number
}

const getGameByType = (type:string):GameType | undefined => {
    /** Return specific game settings */
    return {
        basic
    }[type]
}


export {type GameType, getGameByType}
