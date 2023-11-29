import {  isEqual } from "lodash";
import { AI } from "./AI";
import * as TWEEN from '@tweenjs/tween.js'

const TileTypes = {
    NORMAL: "NORMAL",
    DOUBLE: "DOUBLE",
    START: "START",
    END: "END"
}


const ActionTypes = {
    UNKNOWN_ACTION: "UNKNOWN_ACTION",
    SELECT_PLAYER: "SELECT_PLAYER",
    ROLL_DICE: "ROLL_DICE",
    MOVE: "MOVE",
    NO_MOVES_AVAILABLE: "NO_MOVES_AVAILABLE",
    SELECT_BEST_MOVE: "SELECT_BEST_MOVE"
}

const PlayerTypes = {
    HUMAN: "HUMAN",
    COMPUTER: 'COMPUTER'
}





class API {
    constructor(onDataChange) {
        this.ai = new AI(this, AI.types.SMART)
        this.onDataChange = onDataChange;
    }

    init() {
        this.create()
    }


    /** valid play-modes */
    modes = [
        [PlayerTypes.HUMAN, PlayerTypes.HUMAN],
        [PlayerTypes.HUMAN, PlayerTypes.COMPUTER],
        [PlayerTypes.COMPUTER, PlayerTypes.COMPUTER]
    ]
    set mode(mode){
        this._mode = mode;
        TWEEN.removeAll()
        this.store()      
    }
    get mode(){
        return this._mode
    }
    


    /** Game defaults */
    getDefaults() {
        return {
            player: null,
            board: Array(3).fill().map(
                (n, y) => Array(8).fill().map(
                    (n, x) => [
                        /** type, player, chipcount */
                        this.getTileType(x, y),
                        (y !== 1 && x === 4) ? y * 0.5 : null,
                        (y !== 1 && x === 4) ? 7 : 0
                    ]
                )
            ),
            action: { type: ActionTypes.UNKNOWN_ACTION },
            dice: null,
            mode: [PlayerTypes.HUMAN,PlayerTypes.HUMAN]
        }
    }

    /** Data listsner */
    get data() { return this._data }
    set data(data) {
        if (!isEqual(data, this._data)) {
            this._data = data;
            if (this.onDataChange) this.onDataChange(data)
        }
    }

 


    /** Store current data(localStorage) */
    store() {
        const defaults = this.getDefaults()
        Object.keys(defaults).forEach(key => {
            localStorage.setItem(key, JSON.stringify(this[`_${key}`]))
        })
    }
    /** Load from localStorage */
    load() {
        const defaults = this.getDefaults()
        Object.keys(defaults).forEach(key => {
            this[`_${key}`] = JSON.parse(localStorage.getItem(key)) || defaults[key]
        })
    }
    /** Update data */
    update() {
        const defaults = this.getDefaults()
        this._action = this.getNextAction()
        this.data = Object.keys(defaults).reduce((data, key) => {
            return { ...data, [key]: this[`_${key}`] }
        }, {})
    }


    



    /** get tiletype from coordinates */
    getTileType(x, y) {
        if (y === 1) {
            if (x === 3) return TileTypes.DOUBLE
        } else {
            if (x === 0 || x === 6) return TileTypes.DOUBLE
            if (x === 4) return TileTypes.START
            if (x === 5) return TileTypes.END
        }
        return TileTypes.NORMAL
    }

    coordinatesToIndex(x, y) {
        if (y === 1) return 5 + x;
        if (x < 5) return 4 - x;
        return 20 - x
    }
    indexToCoordinates(i, p) {
        if (i < 0 || i > 15) return // Invalid index 
        if (i < 5) return [4 - i, p * 2]
        if (i > 12) return [20 - i, p * 2]
        return [i - 5, 1]
    }

    getAvailableMoves() {
        const n = this._dice.reduce((p, c) => p + c, 0)

        /** Throw 0, no moves */
        if (n === 0) return;

        /** Collect from-tiles */
        let moves = []
        this._board.forEach((row, y) => {
            row.forEach(([type, player, chips], x) => {
                if (type !== TileTypes.END && player === this._player && chips > 0) {
                    moves.push([[x, y]])
                }
            })
        })

        /** Collect target-tiles*/
        moves.forEach(move => {
            const [[x, y]] = move;
            const target = this.indexToCoordinates(
                this.coordinatesToIndex(x, y) + n,
                this._player
            );
            move.push(target)
        })

        /** Validate moves */
        moves = moves.filter(move => {
            const [, target] = move;
            if (!target) return false;
            const [tx, ty] = target;
            const [type, player, chips] = this._board[ty][tx];
            if (type === TileTypes.DOUBLE && chips) return false;
            if (type !== TileTypes.END && player === this._player && chips) return false;
            return true
        })

        if (moves.length > 0) return moves

    }



    getNextAction() {

     
        
        const action = {
            type: ActionTypes.UNKNOWN_ACTION,
            options: [],
            agent: this._mode[this._player],
        }
        if (this._board[0][5][2] === 7 || this._board[2][5][2] === 7) {
            /** Game is finished */
        } else if (this._player === null) {
            action.type = ActionTypes.SELECT_PLAYER
            action.options = ['RAND', 0, 1]
        } else if (this._dice === null) {
            action.type = ActionTypes.ROLL_DICE
        } else {
            const availableMoves = this.getAvailableMoves()
            if (availableMoves) {
                action.type = ActionTypes.MOVE
                action.options = availableMoves
            } else {
                action.type = ActionTypes.NO_MOVES_AVAILABLE
            }
        }

        return action
    }

    /** Core */
    create() {
        this.load();
        this.update();
    }
    delete() {
        const defaults = this.getDefaults()
        Object.keys(defaults).forEach(key => {
            if( key !== 'mode' ) localStorage.removeItem(key)
        })


        this.load()
        this.update();

    }
    action(type, value) {
       

        switch (type) {
            case ActionTypes.SELECT_BEST_MOVE:
                return this.ai.getBestOption(value)
            case ActionTypes.SELECT_PLAYER:
                this._player = typeof value === 'number' ?
                    value : Math.round(Math.random())
                break;
            case ActionTypes.ROLL_DICE:
                this._dice = value
                break;
            case ActionTypes.MOVE:
                const [[fx, fy], [tx, ty]] = value;
                const [targettype, targetplayer, targetchips] = this._board[ty][tx];
                if (targetchips && targetplayer !== this._player) {
                    this._board[ty][tx][2]-- /** Remove enemy chip */
                    const [esx, esy] = this.indexToCoordinates(0, (this._player + 1) % 2)
                    this._board[esy][esx][2]++ /** Add chip to enemy start */

                }

                this._board[fy][fx][2]-- /** Remove from source */
                this._board[ty][tx][2]++ /** Add to target */
                this._board[ty][tx][1] = this._player /** Assign correct player */

                /** Select next player if not on a double */
                if (targettype !== TileTypes.DOUBLE) {
                    this._player = (this._player + 1) % 2;
                }

                /** End move */
                this._dice = null

                break;
            case ActionTypes.NO_MOVES_AVAILABLE:
                this._dice = null
                this._player = (this._player + 1) % 2;
                break;


            default:
                break;
        }

        this.update();
        this.store();
    }

}

export { API, ActionTypes, TileTypes, PlayerTypes }