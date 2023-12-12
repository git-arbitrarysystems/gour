import { Tile } from "."

type DirectionalNode = {
    x: number
    y: number
    vx: number
    vy: number,
    tile: Tile
}

enum Layout {
    RECTANGLE = "RECTANGLE",
    CIRCLE = "CIRCLE",
    SQUARE = "SQUARE",
    OVAL = "OVAL"
}

const getLayout = (type: Layout, tileCount: number, w:number = 1, h:number = 1) => {
    
    // Tiles per side
    
    // tilesOnX * 2 + tilesOnY * 2 - 4 = count
    // tileOnX = ( count + 4 - tilesOnY * 2 ) / 2
    // tilesOnY = ( count + 4 - tilesOnX * 2 ) / 2
    // tilesOnX = (w/h) * tilesOnY
    // tilesOnY = (h/w) * tilesOnX

    // tilesOnX * 2 + (w/h) * tilesOnX * 2 = count + 4
    // ( 2+2*(w/h) ) * tilesOnX = count + 4
    const tilesOnX = (tileCount + 4) / (2 + 2 * (w/h))
    const tilesOnY = (tileCount + 4) / (2 + 2 * (h/w))


   
    const xAxisTileCount =  Math.ceil(tilesOnX)
    const yAxisTileCount =  Math.ceil(tilesOnY)
    const space = xAxisTileCount * 2 + yAxisTileCount * 2 - 4
    console.log(
        type,tileCount, w, h, '\n', 
        {tilesOnX, tilesOnY},
        {xAxisTileCount, yAxisTileCount},
        {space}
    )

    return [...Array(tileCount)]
}


const forceDirectedLayout = (tiles: Tile[]) => {
    const directionalTiles: DirectionalNode[] = tiles.map((tile) => ({
        x: Math.random(),
        y: Math.random(),
        vx: 0,
        vy: 0,
        tile
    }))

    const step = () => {

        const gravitationalStrength = 0.1;
        const attractionStrength = 0.05;
        const repulsionStrength = 0.002
        const friction = 0.5

        /** Update speed */
        directionalTiles.forEach(directionalTile => {

            const { x, y, tile: { next } } = directionalTile

            let dx, dy, d

            /** Gravity */
            dx = (0.5 - x)
            dy = (0.5 - y)
            d = Math.sqrt(dx * dx + dy * dy);
            directionalTile.vx += dx * d * gravitationalStrength
            directionalTile.vy += dy * d * gravitationalStrength


            /** Repulsion */
            directionalTiles.forEach((otherTile) => {
                const { x: tx, y: ty } = otherTile
                dx = tx - x;
                dy = ty - y;
                d = Math.sqrt(dx * dx + dy * dy);
                if (d !== 0) {
                    directionalTile.vx -= dx / d * repulsionStrength
                    directionalTile.vy -= dy / d * repulsionStrength
                }

            })

            /** Attraction */
            next.forEach((index) => {
                const { x: tx, y: ty } = directionalTiles[index]
                dx = tx - x;
                dy = ty - y;
                d = Math.sqrt(dx * dx + dy * dy);
                if (d != 0) {

                    directionalTile.vx += dx * d * attractionStrength
                    directionalTile.vy += dy * d * attractionStrength
                }

            })





        })

        directionalTiles.forEach(directionalTile => {
            directionalTile.x += directionalTile.vx;
            directionalTile.y += directionalTile.vy

            directionalTile.vx *= friction
            directionalTile.vy *= friction
        })



    }


    return { directionalTiles, step }


}

export { forceDirectedLayout, getLayout, Layout }