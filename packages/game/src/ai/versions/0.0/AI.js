
import { TileTypes, AI_Types } from "../../../Models";

const DefaultScores = {

    FROM_DOUBLE:10, /** Leaving a double */
    TO_DOUBLE:20, /** Arriving at a double */
    
    FROM_CENTER:-40, /** Leaving the center double */
    TO_CENTER:40, /** Arriving at the center double */

    FROM_SAFE:-5, /** Leaving the safe area */
    TO_SAFE:10, /** Getting to the safe area */
    
    HIT:25, /** Taking out an opponent */
    HIT_LATE:25, /** Taking out an opponent after the center dot */
    FINISH:3, /** Reaching the destination */

    CURRENT_DANGER:20, /** React to danger currently behind me */
    FUTURE_DANGER:-10, /** Analyse danger that will be behind me */
    //CHASE:1, /** Look ahead for prey */
    
    DISTANCE:(1/16) * 5 /** Bonus for each step in the right direction */
    
} 

// const DefaultScores = {
    
//         FROM_DOUBLE: 0,
//         TO_DOUBLE: 0,
//         FROM_CENTER: 0,
//         TO_CENTER: 0,
//         FROM_SAFE: 0,
//         TO_SAFE: 0,
//         HIT: 0,
//         HIT_LATE: 0,
//         FINISH: 0,
//         CURRENT_DANGER: 0,
//         FUTURE_DANGER: 0,
//         DISTANCE: 0
     
// }


class AI{
    constructor(api, type = AI_Types.SMART, scores = DefaultScores ){
        
        this.api = api;
        this.type = type;
        this.scores = scores;

    }

    get board(){
        return this.api.data.board;
    }
    get player(){
        return this.api.data.player
    }
    tileContainsEnemy(x,y){
        const [, player, count ] = this.board[y][x]
        return ( count > 0 && player !== this.player ) ? 1 : 0;
    }
    isCenter(x,y){
        return y === 1 && x === 3 ? 1 : 0;
    }
    isSafe(x,y){
        return y !== 1 || x === 3 ? 1 : 0
    }
    getDiceChance(value){
        if( value === 2 ) return 6/16
        if( value === 1 || value === 3 ) return 4/16
        if( value === 0 || value === 4 ) return 1/16
        return 0
    }
    getIncentiveToRun(sx, sy){
        const index = this.api.coordinatesToIndex(sx, sy);

        /** You are only threatened in the middle row */
        if( sy !== 1 ) return 0

        /** You are never threatened on the center tile */
        if( sx === 3 ) return 0;

        /** Look behind me */
        let incentive = 0;
        for( var i = index-1; i>=0; i--){
            const [tx, ty] = this.api.indexToCoordinates(i, (this.player + 1) % 2 );
            const distance = index - i;
            if( this.tileContainsEnemy(tx, ty) ){
                if( distance <= 4 ){
                    /** In reach of dicethrow, incentive increases by dice-chance to hit me */
                    incentive += this.getDiceChance(distance);
                }else{
                    /** Out of reach of dicethrow, incentive decreases by 50% per step */
                    incentive += (1/16) / Math.pow(2, distance-4)
                }
            }
        }
        return incentive
    }

    getBestOption(options){

        if( this.type === AI_Types.RANDOM ){
            return options[Math.floor(Math.random() * options.length)]
        }

        let max = Number.NEGATIVE_INFINITY
        const scoredOptions = options.map( option => {
            let score = {total:0, values:{}, results:{}};
            const [[sx,sy], [tx, ty]] = option;

            const sourceType = this.api.getTileType(sx, sy)
            const targetType = this.api.getTileType(tx, ty)
           
            
            /** Analyse source position */
            score.results.FROM_DOUBLE = (sourceType ===  TileTypes.DOUBLE) ? 1: 0;
            score.results.FROM_CENTER = this.isCenter(sx, sy)
            score.results.FROM_SAFE = (this.isSafe(sx, sy) && !this.isSafe(tx, ty)) ? 1 : 0
            score.results.CURRENT_DANGER = this.getIncentiveToRun(sx, sy)

            /** Analyse target position */
            score.results.TO_DOUBLE = (targetType ===  TileTypes.DOUBLE) ? 1 : 0;
            score.results.TO_CENTER = this.isCenter(tx, ty)
            score.results.TO_SAFE = (!this.isSafe(sx, sy) && this.isSafe(tx, ty)) ? 1 : 0
            score.results.FINISH = (targetType === TileTypes.END) ? 1 : 0;
            score.results.HIT = this.tileContainsEnemy(tx, ty)
            score.results.HIT_LATE = score.results.HIT * (ty === 1 && tx > 3) ? 1 : 0;
            score.results.DISTANCE = this.api.coordinatesToIndex(tx, ty);
            score.results.FUTURE_DANGER = this.getIncentiveToRun(tx, ty)
            
            /** Calculate score */
            Object.keys( score.results ).forEach( key => {
                if( score.results[key] ){
                    score.values[key] = score.results[key] * this.scores[key];
                    score.total += score.values[key]
                }else{
                    delete score.results[key]
                }
            })
            
            max = Math.max(score.total, max)
            


            return {option, score}
        }).filter( n => n.score.total === max).sort((a,b) => b.score.total - a.score.total);

        //console.log( scoredOptions, JSON.stringify(scoredOptions[0], null, 2))

        return scoredOptions[ Math.floor(Math.random() * scoredOptions.length) ].option
    }



}




export {AI, DefaultScores}