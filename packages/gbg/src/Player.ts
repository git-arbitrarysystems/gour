import { Pawn } from "./Pawn";

enum PlayerTypes{
    HUMAN = "HUMAN",
    COMPUTER = "COMPUTER"
}

class Player{

    public index:number | undefined
    public pawns:Pawn[]

    constructor(index:number, pawns:number = 0){
        this.index = index;
        this.pawns = [...Array(pawns)].map( (n,index) => {
            return new Pawn(index)
        })
    }
}

export {Player, PlayerTypes}