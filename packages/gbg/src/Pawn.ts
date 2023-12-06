class Pawn{

    public index:number 
    public tile?:number

    constructor(index:number, tile:number = 0){
        this.index = index
        this.tile = tile
    }
}

export {Pawn}