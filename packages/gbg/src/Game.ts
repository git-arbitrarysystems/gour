import { Board } from "./Board"
import { Dice } from "./Dice";
import { Player } from "./Player";
import { Tile } from "./Tile";
import { getGameByType } from "./games";

type GameType = {
    players: number,
    tiles: number,
    dice: number,
    pawns: number
}

enum Actions {
    SELECT_PLAYER,
    THROW_DICE,
    MOVE,
    UNKNOWN
}

enum Choose{
    RANDOM = "RANDOM"
}

type Action = {
    type: Actions,
    options?: any[]
}

type GameState = {
    type: string,
    ppp?: number[] /** ppp: Player(index) Pawn(index) Position(index) */
    player?: number /** Current player */
    dice?: number[] /** Current dice value */
}

class Game {

    public board: Board | undefined
    public players: Player[] = []
    public dice: Dice[] = []
    public state: GameState | undefined

    constructor(state: GameState | undefined = undefined) {
        this.load(state)
    }

    init(data: GameType) {

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


    load(state: GameState | undefined) {
        /** Load a game state */
        this.state = state || { type: 'basic' }



        /** Retreive necessary data for game setup */
        const { type } = this.state;
        const typeData: GameType | undefined = getGameByType(type)
        if (typeData === undefined) throw new Error(`No such gametype ${type}`)

        /** Then initialize the game */
        this.init(typeData)

        /** Request an action */
        this.request()
    }

    save() {
        /** Save a game state */
    }

    request(): Action {

        /** Retreive the next required action */
        const action:Action = { type: Actions.UNKNOWN }
        if (!this.state) return action;

        const { player, dice } = this.state

        if (player === undefined) {
            /** The first action in a game is always to select a player */
            action.type = Actions.SELECT_PLAYER
            action.options = [
                ...this.players.map( player => player.index ),
                Choose.RANDOM
            ]
        } else if (dice === undefined) {
            /** Once a player has been defined the dice should be thrown */
            action.type = Actions.THROW_DICE
        } else {
            /** Once dice have been thrown a selection of moves should be found */
            action.type = Actions.MOVE
        }

        console.dir({ action })
        return action

    }
    execute() {
        /** Execute the next action */
    }



}

export { Game, GameType, GameState }