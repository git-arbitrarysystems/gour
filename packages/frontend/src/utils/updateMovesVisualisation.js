var xmlns = 'http://www.w3.org/2000/svg';

let interactiveTiles = []

const hoverStyles = [
    ['background-color', '#00f5'],
    ['cursor', 'pointer']
]
const setHoverStyles = tile => {
    tile.linePolygon?.setAttribute('visibility', 'visible')
    hoverStyles.forEach(([property, value]) => tile.style[property] = value)
} 
const unsetHoverStyles = tile => {
    tile.linePolygon?.setAttribute('visibility', 'hidden')
    hoverStyles.forEach(([property]) => tile.style.removeProperty(property) )
}

const onTileOver = e => setHoverStyles(e.currentTarget)
const onTileOut = e => unsetHoverStyles(e.currentTarget)
const tileEvents = [
    ['mouseover', onTileOver],
    ['mouseout', onTileOut]
]


const registerInteractiveTiles = (tiles, props) => {
    tiles.forEach( tile => {
        interactiveTiles.push( tile)
        tileEvents.forEach( ([event, fn]) => tile.addEventListener(event, fn) )

        tile.arbitraryProps = Object.keys(props)
        tile.arbitraryProps.forEach( key => {
            tile[key] = props[key]
        })
        
    })
    
    
    
}
const unregisterInteractiveTiles = () => {
    interactiveTiles.forEach( tile => {
        tileEvents.forEach( ([event, fn]) => tile.removeEventListener(event, fn) )
        tile.arbitraryProps.forEach( key => tile[key] = undefined )
        unsetHoverStyles(tile)
    })
    interactiveTiles = []
}

const updateMovesVisualisation = (container, moves, onClickTile) => {

    if (!container) return
    console.log({moves})

    /** Get/Create SVG Element */
    let svg = container.getElementsByTagNameNS(xmlns, 'svg')[0]
    if (!svg) {
        svg = document.createElementNS(xmlns, 'svg')
        svg.setAttribute('fill', 'none')
        svg.setAttribute('stroke', '#000')
        svg.setAttribute('stroke-width', 1)
        container.appendChild(svg)
    }

    /** Set SVG Size */
    const overlayBox = container.getBoundingClientRect()
    svg.setAttribute('viewBox', `0 0 ${overlayBox.width} ${overlayBox.height}`)

    /** Clear SVG */
    while (svg.lastChild) svg.removeChild(svg.lastChild)

    /** Clear tiles */
    unregisterInteractiveTiles()

    /** Handle moves in format [[fromX, fromY], [toX, toY]] */
    if (Array.isArray(moves)) {
        moves.forEach(move => {
            const [[fromX, fromY], [toX, toY]] = move
            const [fromTile, toTile] = [
                document.getElementById(`tile${fromX},${fromY}`), 
                document.getElementById(`tile${toX},${toY}`)
            ]

            

            if (fromTile && toTile) {
                const [fromBox, toBox] = [fromTile.getBoundingClientRect(), toTile.getBoundingClientRect()];
                const [fx, fy, tx, ty] = [
                    (fromBox.x + fromBox.width * 0.5 - overlayBox.x),
                    (fromBox.y + fromBox.height * 0.5 - overlayBox.y),
                    (toBox.x + toBox.width * 0.5 - overlayBox.x),
                    (toBox.y + toBox.height * 0.5 - overlayBox.y)

                ]

                const polygon = document.createElementNS(xmlns, 'polygon')
                polygon.setAttribute('points', `${fx},${fy} ${tx},${ty}`)
                polygon.setAttribute('visibility', 'hidden')
                svg.appendChild(polygon)

                registerInteractiveTiles([fromTile, toTile], {
                    linePolygon:polygon, 
                    onclick:() => onClickTile(move)
                })


            }
        })
    }
}


export default updateMovesVisualisation