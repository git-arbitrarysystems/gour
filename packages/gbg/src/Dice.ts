
enum DiceType{
    COIN = "COIN",
    FOUR_SIDED = "FOUR_SIDED",
    SIX_SIDED = "SIX_SIDED"
}

class Dice {

    public type:DiceType

    public min:number = 1
    public max:number = 1
    public value:number | undefined
    

    constructor(type:DiceType = DiceType.SIX_SIDED) {
        this.type = type;

        /** Store min/max */
        this.min = 1;
        if (type === DiceType.COIN) this.max = 2;
        if (type === DiceType.FOUR_SIDED) this.max = 4;
        if (type === DiceType.SIX_SIDED) this.max = 6;

    }


    roll() {
        this.value = this.min + Math.floor(Math.random() * (this.max + 1 - this.min))
    }
}

export { Dice, DiceType }