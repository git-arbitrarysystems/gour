import { Game } from "./Game"

test('default game constructor', () => {
    const game = new Game()
    expect(game).toBeDefined()

    console.dir(game, {depth:null})

    /** Run a game loop */
    // for( var i=0; i<30;i++){
    //     game.request()
    //     game.board?.render()
    //     game.execute()
    // }

    //console.dir(game, {depth:null})

    
})