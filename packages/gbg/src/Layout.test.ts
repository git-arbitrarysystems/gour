import { getRectangularLayout } from "./Layout"
//import { Tile } from "./Tile";

// const tiles = (num:number):Tile[] => {
//     return [...Array(num)].map( (_,i) => {
//         return new Tile(i, [], [(i+1)%num])
//     })
// }

test('Layout.getRectangularLayout', () => {
   const result = getRectangularLayout(10, 1)
    expect(result).toBeDefined()
    console.log(result)
})
