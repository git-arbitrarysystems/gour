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


    getRoutesByLength(startIndex: number, length: number): number[][] {
        const routes: number[][] = [];
        const tiles:Tile[] = this.tiles;
      
        function exploreRoute(currentIndex: number, remainingSteps: number, currentPath: number[]): void {
          if (remainingSteps === 0) {
            routes.push([...currentPath, currentIndex]);
            return;
          }
      
          const nextIndices = tiles[currentIndex].next || [];
      
          for (const nextIndex of nextIndices) {
            exploreRoute(nextIndex, remainingSteps - 1, [...currentPath, currentIndex]);
          }
        }
      
        exploreRoute(startIndex, length, []);
      
        return routes;
      }

}

export {Board}