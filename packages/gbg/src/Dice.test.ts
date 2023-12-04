import { Dice, DiceType } from "./Dice";



/** Test each dice-type */
[DiceType.COIN, DiceType.FOUR_SIDED, DiceType.SIX_SIDED].forEach(type => {

    let dice = new Dice(type),
        throwCount = 100,
        sum = 0;

    test(`roll a dice of type ${DiceType[type]}`, () => {

        /** Roll n times */
        for (var i = 0; i < throwCount; i++) {
            dice.roll()
            expect(dice.value).toBeGreaterThanOrEqual(1);
            expect(dice.value).toBeLessThanOrEqual(dice.max)
            sum += dice.value ?? 0;
        }

        /** Check for appropriate averages */
        const average = sum / throwCount,
            expectedAverage = dice.min + (dice.max - dice.min) * 0.5,
            allowedAverageDivert = 0.5,
            expectedAverageHi = expectedAverage + allowedAverageDivert,
            expectedAverageLow = expectedAverage - allowedAverageDivert;

        //console.log({average, expectedAverage})

        expect(average).toBeLessThanOrEqual(expectedAverageHi)
        expect(average).toBeGreaterThanOrEqual(expectedAverageLow)
    });
})

