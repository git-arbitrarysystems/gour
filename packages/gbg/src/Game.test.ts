import { Game } from "./Game"

test('default game constructor', () => {
    const game = new Game()
    expect(game).toBeDefined()

    console.dir(game, {depth:null})
})