import { Player } from "./Player";
import { Tile } from "./Tile";
import { MapType } from "./games";



class Board {

  public tiles: Tile[] = []
  public players: Player[] = []
  constructor(map: MapType, players: Player[]) {
    this.tiles = this.mapToTiles(map);
    this.players = players
  }


  mapToTiles(map: MapType): Tile[] {

    let {mapData, types } = map

   
    mapData = Array.isArray(mapData) ? mapData : mapData.replace(/ /gi, '').split('\n')
        .filter(line => line.length > 0)
        .map(line =>
          line
            .split('')
            .map(n => String(`.0`).includes(n) ? 0 : 1)
        )
        console.log({ mapData })

    return []
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