
enum DiceType {
    COIN = "COIN",
    FOUR_SIDED = "FOUR_SIDED",
    SIX_SIDED = "SIX_SIDED"
}

class Dice {

    public type: DiceType

    public min: number = 0
    public max: number = 0
    public value: number | undefined


    constructor(type: DiceType = DiceType.SIX_SIDED) {
        this.type = type;

        /** Store min/max */
        this.min = 0;
        if (type === DiceType.COIN) {
            this.max = 1;
        } else if (type === DiceType.FOUR_SIDED) {
            this.min = 1;
            this.max = 4;
        } else if (type === DiceType.SIX_SIDED) {
            this.min = 1;
            this.max = 6;
        }

    }


    roll() {
        this.value = this.min + Math.floor(Math.random() * (this.max + 1 - this.min))
    }
}

export { Dice, DiceType }