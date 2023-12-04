import { Player } from "./Player";
import { Tile } from "./Tile";

class Board{

    public tiles:Tile[] = []
    constructor(tiles:Tile[]){
        this.tiles = tiles;
    }

    move(player:Player, tile:Tile){
        /** Move player to tile */
    }
}

export {Board}