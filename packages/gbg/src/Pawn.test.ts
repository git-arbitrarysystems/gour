import { Pawn } from "./Pawn"

test('Pawn constructor', () => {
    const pawn = new Pawn(0)
    expect(pawn).toBeDefined()
})