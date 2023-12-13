"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layout = exports.getRectangularLayout = exports.getLayout = void 0;
var Layout;
(function (Layout) {
    Layout["RECTANGLE"] = "RECTANGLE";
    Layout["CIRCLE"] = "CIRCLE";
    Layout["SQUARE"] = "SQUARE";
    Layout["OVAL"] = "OVAL";
})(Layout || (exports.Layout = Layout = {}));
var getLayout = function (type, tiles, ratio) {
    if (type === Layout.RECTANGLE) {
        return getRectangularLayout(tiles.length, ratio);
    }
    else {
        throw new Error("Invalid layout type: ".concat(type));
    }
    return [];
};
exports.getLayout = getLayout;
var getRectangularLayout = function (tileCount, ratio) {
    if (ratio === void 0) { ratio = 1; }
    /* Ratio to width,height, max = 1; */
    var d = Math.max(1 / ratio, 1 * ratio), w = (ratio * 1) / d, h = (1 / ratio) / d;
    var tilesOnXAxis = (tileCount + 4) / (2 + 2 * (h / w));
    var tilesOnYAxis = (tileCount + 4) / (2 + 2 * (w / h));
    var size = Math.min(1 / tilesOnXAxis, 1 / tilesOnYAxis);
    var xAxisTileCount = Math.ceil(tilesOnXAxis);
    var yAxisTileCount = Math.ceil(tilesOnYAxis);
    /** Maximum space for tiles */
    var space = xAxisTileCount * 2 + yAxisTileCount * 2 - 4;
    /** Create positions for each tile in space */
    var xDir = 1, yDir = 0, x = 0, y = 0;
    return __spreadArray([], Array(space), true).map(function () {
        /** Current pointer */
        var position = { x: x, y: y, size: size };
        /** Rotate right 90deg */
        if (xDir === 1 && x + size >= w) {
            xDir = 0;
            yDir = 1;
        }
        else if (yDir === 1 && y + size >= h) {
            xDir = -1;
            yDir = 0;
        }
        else if (xDir === -1 && x - size <= 0) {
            xDir = 0;
            yDir = -1;
        }
        else if (yDir === -1 && y - size <= 0) {
            xDir = 1;
            yDir = 0;
        }
        x += xDir * size;
        y += yDir * size;
        return position;
    });
};
exports.getRectangularLayout = getRectangularLayout;
