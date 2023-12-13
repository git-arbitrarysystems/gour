import { Tile } from "./Tile"



enum Layout {
    RECTANGLE = "RECTANGLE",
    MAP = "MAP",
    // CIRCLE = "CIRCLE",
    // SQUARE = "SQUARE",
    // OVAL = "OVAL"
}

type TilePosition = {
    x: number,
    y: number,
    xSize: number,
    ySize: number
}

const getLayout = (type: Layout, tiles: Tile[], ratio: number): TilePosition[] => {

    if (type === Layout.RECTANGLE) {
        return getRectangularLayout(tiles.length, ratio)
    } else {
        throw new Error(`Invalid layout type: ${type}`)
    }



    return []
}

const getLayoutFromMap = (map: number[][] | string): TilePosition[] => {
    
     /** String map to array */
    if( typeof map === 'string' ){
        map = map.replace(/ /gi, '').split('\n')
        .filter(line => line.length > 0)
        .map( line => 
            line
                .split('')
                .map( n => String(`.0`).includes(n) ? 0 : 1 )
        )
    }
    
    const w: number = map.length,
        h: number = map[0].length;
    const xSize: number = 1 / w,
        ySize: number = 1 / h


    const result: TilePosition[] = [];
    [...Array(w * h)].forEach((_, index) => {
        const x = index % w,
            y = Math.floor(index / h)
        if (map[y][x]) {
            result.push({ x: x / w, y: y / h, xSize, ySize })
        }
    })

    return result
}

/** Get best rectangular layout for tiles on edge */
const getRectangularLayout = (tileCount: number, ratio: number = 1): TilePosition[] => {

    /* Ratio to width,height, max = 1; */
    const w = 1,
        h = 1 / ratio; 

    const tilesOnXAxis = Math.ceil((tileCount + 4) / (2 + 2 * (h / w)))
    const tilesOnYAxis = Math.ceil((tileCount + 4) / (2 + 2 * (w / h)))
    const xSize = 1 / tilesOnXAxis;
    const ySize = 1 / tilesOnYAxis

    /** Maximum space for tiles */
    const space = tilesOnXAxis * 2 + tilesOnYAxis * 2 - 4

    /** Create positions for each tile in space */
    let xDir = 1,
        yDir = 0,
        x = 0,
        y = 0;
    return [...Array(space)].map(() => {

        /** Current pointer */
        const position: TilePosition = { x, y, xSize, ySize }

        /** fix rounding issues */
        const delta = 0.001

        /** Rotate right 90deg */
        if (xDir === 1 && x + xSize >= 1 - delta) {
            xDir = 0;
            yDir = 1;
        } else if (yDir === 1 && y + ySize >= 1 - delta) {
            xDir = -1;
            yDir = 0
        } else if (xDir === -1 && x - xSize < 0) {
            xDir = 0;
            yDir = -1
        } else if (yDir === -1 && y - ySize < 0) {
            xDir = 1
            yDir = 0
        }


        x += xDir * xSize;
        y += yDir * ySize;

        return position
    })

}




export { getLayout, getRectangularLayout, getLayoutFromMap, Layout }