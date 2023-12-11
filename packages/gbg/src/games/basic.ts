import { DiceType } from "../Dice";
import { GameType } from "./index";


export default {
    players:3,
    pawns:2,
    tiles:10,
    dice:{
        num:1,
        type:DiceType.COIN
    }
} as GameType

