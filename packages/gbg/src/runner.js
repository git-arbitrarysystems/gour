const {Game} = require('./Game') 
const game = new Game()

const steps = 100;
let step = 0;
const Step = () => {
    return new Promise( (resolve, reject) => {

        console.clear( )
        console.log(step)
        

        game.request()
        const {type} = game.state.action
        
        

        game.execute()
        const dice = game.state.dice?.reduce( (p,c) => p + c, 0)
        console.log(`Player ${game.state.player} ${type} ${ dice === undefined ? '' : dice}`)
        console.log({winner:game.winner})
        console.log('Board:\n' + game.board?.render() )

        if( step < steps && game.winner === undefined ){
            step++;
            setTimeout( () => {
                Step()
            }, 20) 
            
        }

    })
}

Step()

