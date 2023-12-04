import { Board } from "./Board"
import { Dice } from "./Dice";
import { Player } from "./Player";
import { State } from "./State";
import { Tile } from "./Tile";
import {getGameByType} from "./games";

type GameType = {
    players:number,
    tiles:number,
    dice:number,
    pawns:number
}

type GameState = {
    type:string
}

class Game {

    public board:Board | undefined
    public players:Player[] = []
    public dice:Dice[] = []
    public state:State | undefined

    constructor(state:GameState = {type:'basic'}) {
        this.load(state)
    }

    init(data:GameType){
        
        /** Initialisation */
        const { tiles, players, pawns, dice } = data;

        /** Setup the board */
        this.board = new Board(
            [...Array(tiles)].map((n, index) => {
                const prev = index > 0 ? [index - 1] : []
                const next = index < tiles - 1 ? [index + 1] : []
                return new Tile(index, prev, next)
            })
        )
        
        /** Setup players & pawns */
        this.players = [...Array(players)].map((n, index) => {
            return new Player(index, pawns)
        })
            
        /** Setup dice */
        this.dice = [...Array(dice)].map((n, index) => {
            return new Dice()
        })

    }


    load(state:GameState | undefined){
        /** Load a game state */
        state = state || {type:'basic'}

        

        /** Retreive nessecary data for game setup */
        const {type} = state;
        const typeData:GameType | undefined = getGameByType(type)
        if (typeData === undefined) throw new Error(`No such gametype ${type}`)

        /** Then initialize the game */
        this.init(typeData)
    }
    
    save(){
        /** Save a game state */
    }

    request(){
        /** Retreive the next required action */
    }
    execute(){
        /** Execute the next action */
    }

   

}

export { Game, GameType, GameState }