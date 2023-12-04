
import { GameType } from "../Game"
import basic from "./basic"



export function getGameByType(type:string):GameType | undefined{
    /** Return specific game settings */
    return {
        basic
    }[type]
}

