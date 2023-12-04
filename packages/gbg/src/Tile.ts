class Tile {

    public index: number | undefined
    public next: number[] = []
    public prev: number[] = []

    constructor(index: number, prev: number[], next: number[]) {
        this.index = index;
        this.next = next;
        this.prev = prev;
    }
}

export { Tile }