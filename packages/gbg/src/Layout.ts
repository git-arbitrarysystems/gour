import { Tile } from "."

type DirectionalNode = {
    x: number
    y: number
    vx: number
    vy: number,
    tile: Tile
}

const forceDirectedLayout = (tiles: Tile[]) => {
    const directionalTiles: DirectionalNode[] = tiles.map((tile, index) => ({
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

            let dx, dy, d, s

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
                    
                    s = 1 / d
                    directionalTile.vx -= dx/d * repulsionStrength
                    directionalTile.vy -= dy/d  * repulsionStrength
                }

            })

            /** Attraction */
            next.forEach((index) => {
                const { x: tx, y: ty } = directionalTiles[index]
                dx = tx - x;
                dy = ty - y;
                d = Math.sqrt(dx * dx + dy * dy);
                if (d !=0 ) {

                    directionalTile.vx += dx*d * attractionStrength
                    directionalTile.vy += dy*d * attractionStrength
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

export { forceDirectedLayout }