var Layout;
(function (Layout) {
    Layout["RECTANGLE"] = "RECTANGLE";
    Layout["MAP"] = "MAP";
    // CIRCLE = "CIRCLE",
    // SQUARE = "SQUARE",
    // OVAL = "OVAL"
})(Layout || (Layout = {}));
const getLayout = (type, tiles, ratio) => {
    if (type === Layout.RECTANGLE) {
        return getRectangularLayout(tiles.length, ratio);
    }
    else {
        throw new Error(`Invalid layout type: ${type}`);
    }
    return [];
};
const getLayoutFromMap = (map) => {
    /** String map to array */
    if (typeof map === 'string') {
        map = map.replace(/ /gi, '').split('\n')
            .filter(line => line.length > 0)
            .map(line => line
            .split('')
            .map(n => Number(n)));
    }
    const w = map.length, h = map[0].length;
    const xSize = 1 / w, ySize = 1 / h;
    const result = [];
    [...Array(w * h)].forEach((_, index) => {
        const x = index % w, y = Math.floor(index / w);
        if (map[y][x]) {
            result.push({ x: x / w, y: y / h, xSize, ySize });
        }
    });
    return result;
};
/** Get best rectangular layout for tiles on edge */
const getRectangularLayout = (tileCount, ratio = 1) => {
    /* Ratio to width,height, max = 1; */
    const w = 1, h = 1 / ratio;
    const tilesOnXAxis = Math.ceil((tileCount + 4) / (2 + 2 * (h / w)));
    const tilesOnYAxis = Math.ceil((tileCount + 4) / (2 + 2 * (w / h)));
    const xSize = 1 / tilesOnXAxis;
    const ySize = 1 / tilesOnYAxis;
    /** Maximum space for tiles */
    const space = tilesOnXAxis * 2 + tilesOnYAxis * 2 - 4;
    /** Create positions for each tile in space */
    let xDir = 1, yDir = 0, x = 0, y = 0;
    return [...Array(space)].map((_, i) => {
        /** Current pointer */
        const position = { x, y, xSize, ySize };
        /** fix rounding issues */
        const delta = 0.001;
        /** Rotate right 90deg */
        if (xDir === 1 && x + xSize >= 1 - delta) {
            xDir = 0;
            yDir = 1;
        }
        else if (yDir === 1 && y + ySize >= 1 - delta) {
            xDir = -1;
            yDir = 0;
        }
        else if (xDir === -1 && x - xSize < 0) {
            xDir = 0;
            yDir = -1;
        }
        else if (yDir === -1 && y - ySize < 0) {
            xDir = 1;
            yDir = 0;
        }
        x += xDir * xSize;
        y += yDir * ySize;
        return position;
    });
};
export { getLayout, getRectangularLayout, getLayoutFromMap, Layout };
