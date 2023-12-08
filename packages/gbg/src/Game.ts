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
    LAST = "LAST",
    NEXT = "NEXT"
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
    type: OptionTypes,
    value: any
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

        /** Setup players & pawns */
        this.players = [...Array(players)].map((n, index) => {
            return new Player(index, pawns)
        })

        /** Setup the board */
        this.board = new Board(
            [...Array(tiles)].map((n, index) => {
                const prev = index > 0 ? [index - 1] : []
                const next = index < tiles - 1 ? [index + 1] : []
                return new Tile(index, prev, next)
            }),
            this.players
        )



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


    get player(): number | undefined {
        return this.state?.player
    }
    set player(n: number | Choice) {
        if (!this.state) {
            throw new Error('Game not initialized')
        }


        if (typeof n === 'number' && n < this.players.length) {
            this.state.player = n;
        } else if (n === Choice.RANDOM) {
            this.state.player = Math.floor(Math.random() * this.players.length)
        } else if (n === Choice.FIRST) {
            this.state.player = 0
        } else if (n === Choice.LAST) {
            this.state.player = this.players.length - 1
        } else if (n === Choice.NEXT) {
            this.state.player = ((this.state.player || 0) + 1) % this.players.length;
        } else {
            throw new Error(`Invalid player: ${n}`)
        }

        /** clear dice for next player*/
        delete this.state.dice
    }


    get winner(): number | undefined {

        /** Negotiate winner */
        let winner: number | undefined = undefined;

        /** Check the board for winner */
        const { board } = this;
        
        /** For now the winner is simply the player with all pawns on the last tile */
        if (board) {
            this.players.forEach(player => {
                if (winner === undefined) {
                    const pawnsOnLastTile = player.pawns.reduce((num, pawn) => {
                        if (pawn.tile === board.tiles.length - 1) return num + 1;
                        return num;
                    }, 0)
                    if (pawnsOnLastTile === player.pawns.length) {
                        winner = player.index
                    }
                }
            })
        }
        return winner
    }


    request(): Action {

        /** Retreive the next required action */
        const action: Action = { type: Actions.UNKNOWN }
        if (!this.state) return action;

        const { player, dice } = this.state
        if( this.winner !== undefined ){

        }else if (player === undefined) {
            /** The first action in a game is always to select a player */
            action.type = Actions.SELECT_PLAYER
            action.options = [
                ...this.players.map(player => ({ type: OptionTypes.VALUE, value: player.index })),
                { type: OptionTypes.SELECTION_METHOD, value: Choice.RANDOM }
            ]
        } else if (dice === undefined) {
            /** Once a player has been defined the dice should be thrown */
            action.type = Actions.THROW_DICE
        } else {
            /** Once dice have been thrown a selection of moves should be found */
            action.type = Actions.MOVE
            const sum = this.dice.reduce((sum, dice) => sum + (dice.value || 0), 0)

            const options: Option[] = []

            this.players[player].pawns.forEach(pawn => {
                if (pawn.tile !== undefined) {
                    const routes = this.board?.getRoutesByLength(pawn.tile, sum)
                    routes?.forEach(route => {
                        const target = route.slice(-1)[0]
                        const value = []
                        value[Position.PLAYER] = player;
                        value[Position.PAWN] = pawn.index;
                        value[Position.POSITION] = target
                        options.push({ type: OptionTypes.VALUE, value })
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

            const values: Option[] = options.filter(({ type }) => type === OptionTypes.VALUE)

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
        //console.log('do', {type, value}, 'from', choice , 'of', options)

        switch (type) {
            case Actions.SELECT_PLAYER:
                this.player = value;
                break;
            case Actions.THROW_DICE:
                if (this.dice.length > 0) {
                    this.state.dice = this.dice.map(
                        dice => {
                            dice.roll()
                            return dice.value
                        }
                    )
                } else {
                    throw new Error(`No dice to roll`)
                }
                break;
            case Actions.MOVE:

                if (value) {
                    const player = value[Position.PLAYER]
                    const pawn = value[Position.PAWN]
                    const position = value[Position.POSITION]
                    this.players[player].pawns[pawn].tile = position
                }

                this.player = Choice.NEXT



                break;
        }

        /** The action has been performed, we can delete it from state */
        delete this.state.action



    }



}

export { Game, GameType, GameState }