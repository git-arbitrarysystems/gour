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
    SELECT_PLAYER = "SELECT_PLAYER",
    THROW_DICE = "THROW_DICE",
    MOVE = "MOVE",
    UNKNOWN = "UNKNOWN"
}

enum Choice {
    RANDOM = "RANDOM",
    FIRST = "FIRST",
    LAST = "LAST"
}

enum Position {
    PLAYER,
    PAWN,
    POSITION
}



enum OptionTypes {
    VALUE = "VALUE",
    SELECTION_METHOD = "SELECTION_METHOD"
}

type Option = {
    type:OptionTypes,
    value:any
}

type Action = {
    type: Actions,
    options?: Option[]
}

type GameState = {
    type: string,
    ppp?: Position[]  /** [Player(index) Pawn(index) Position(index)] */
    player?: number /** Current player */
    dice?: (number | undefined)[] /** Current dice value */
    action?: Action  /** Current action to perform */
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
        const action: Action = { type: Actions.UNKNOWN }
        if (!this.state) return action;

        const { player, dice } = this.state

        if (player === undefined) {
            /** The first action in a game is always to select a player */
            action.type = Actions.SELECT_PLAYER
            action.options = [
                ...this.players.map(player => ({type:OptionTypes.VALUE, value:player.index})),
                { type:OptionTypes.SELECTION_METHOD,  value: Choice.RANDOM }
            ]
        } else if (dice === undefined) {
            /** Once a player has been defined the dice should be thrown */
            action.type = Actions.THROW_DICE
        } else {
            /** Once dice have been thrown a selection of moves should be found */
            action.type = Actions.MOVE
            const sum = this.dice.reduce( (sum, dice) => sum + (dice.value || 0), 0 )

            const options:Option[] = []

            this.players[player].pawns.forEach( pawn => {
                if( pawn.tile !== undefined ){
                    const routes = this.board?.getRoutesByLength(pawn.tile, sum)
                    routes?.forEach( route => {
                        const target = route.slice(-1)[0]
                        const value = []
                        value[Position.PLAYER] = player;
                        value[Position.PAWN] = pawn.index;
                        value[Position.POSITION] = target
                        options.push({type:OptionTypes.VALUE, value})
                    })
                }
            })

            action.options = options


        }

        this.state.action = action;

        return action

    }
    execute(choice: string | number | undefined = Choice.RANDOM) {

        /** Execute the current action */
        if (!this.state?.action) {
            throw new Error('No action to preform')
        }

        /** Get action type */
        const { type, options } = this.state.action

        /** Hold a selected halue */
        let value: any | undefined;

        if (Array.isArray(options) && options.length > 0) {

            const values:Option[] = options.filter( ({type}) => type === OptionTypes.VALUE)

            switch (typeof choice) {
                case 'number':
                    if (choice < options.length) {
                        value = values[choice].value
                    } else {
                        throw new Error(`Invalid choice ${choice} for values ${values}`)
                    }
                    break;
                case 'string':
                    if (choice === Choice.FIRST) {
                        value = values[0].value
                    } else if (choice === Choice.LAST) {
                        value = values.slice(-1)[0].value
                    } else if (choice === Choice.RANDOM) {
                        value = values[Math.floor(Math.random() * values.length)].value
                    }
                    break;
            }
        }

        /** We should now have an action and a value */
        console.log('do', {type, value}, 'from', choice , 'of', options)

        switch( type ){
            case Actions.SELECT_PLAYER:
                if( typeof value === 'number' && value < this.players.length){
                    this.state.player = value
                }else{
                    throw new Error(`Invalid value ${value} for player(${this.players.length})`)
                }
                break;
            case Actions.THROW_DICE:
                if( this.dice.length > 0 ){
                    this.state.dice = this.dice.map( 
                        dice => {
                            dice.roll()
                            return dice.value
                        }
                    )
                }else{
                    throw new Error(`No dice to roll`)
                }
                break;
        }

        /** The action has been performed, we can delete it from state */
        delete this.state.action



    }



}

export { Game, GameType, GameState }