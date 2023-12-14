import { DiceType } from "../Dice";
import { GameType } from "./index";

const mapData = `
oooooooooooooooo
...............o
oooooooooooooo.o
o............o.o
o.oooooooo...o.o
o.o..........o.o
o.oooooooooooo.o
o..............o
oooooooooooooooo
`

export default {
    players:{
        count:3,
        pawns:2
    },
    dice:{
        num:1,
        type:DiceType.COIN
    },
    board:{
        map:{
            mapData
        }
    }
} as GameType

