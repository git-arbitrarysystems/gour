import { Player } from "./Player";
import { Tile } from "./Tile";

enum Layout{
  RECTANGLE = "RECTANGLE",
  CIRCLE = "CIRCLE",
  SQUARE = "SQUARE",
  OVAL = "OVAL"
}

class Board {

  public tiles: Tile[] = []
  public players: Player[] = []
  constructor(tiles: Tile[], players: Player[]) {
    this.tiles = tiles;
    this.players = players
  }


  getRoutesByLength(startIndex: number, length: number): number[][] {
    const routes: number[][] = [];
    const tiles: Tile[] = this.tiles;

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


  log() {
    return this.tiles.map(tile => {
        const pawns = this.players.map(({ pawns }) => {
          return pawns.reduce((prev, pawn) => {
            if (pawn.tile === tile.index) return prev + 1;
            return prev;
          }, 0)
        })
        return `Tile ${tile.index}: Pawns[${pawns.join(', ')}]`;
      }).join('\n')
    
  }

}

export { Board }