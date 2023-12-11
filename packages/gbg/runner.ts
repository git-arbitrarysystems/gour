import {Game} from './src/Game'

/** Instantiate game */
const game = new Game()

/** Run limits */
let steps = 100, step = 0, delay = 100;

const Step = () => {
    return new Promise( () => {

        /** */
        console.clear()
        console.log(step)
        
        /** Get next step in the game */
        game.request()

        if( game.state?.action){
            
            /** Execute action set by request */
            const {type} = game.state?.action 
            game.execute()

            /** Store dice value */
            const dice = game.state.dice?.reduce( (p,c) => (p || 0) + (c || 0), 0)
            
            /** Output */
            console.log(`Player ${game.state.player} ${type} ${ dice === undefined ? '' : dice}`)
            console.log('Board:\n' + game.board?.render() )

            /** Negotiate winner */
            const winner = game.winner;
            if( winner !== undefined ) console.log({winner})

            /** Run untill game finishes */
            if( step < steps && winner === undefined ){
                setTimeout( () => Step(), delay )
            }

            /** */
            step++;
        }

    })
}

Step()

