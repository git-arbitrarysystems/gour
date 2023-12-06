const fs = require('fs');

/** Local storage placeholder */
localStorage = {
    setItem:() => {},
    getItem:() => null,
    removeItem:() => {},
    clear:() => {}
}


const { API, PlayerTypes, AIv0_0, AI_Types, AIv0_0_DefaultScores } = require('gour/dist');
const { resolve } = require('path');


 
function RunGame(ais) {
    return new Promise((resolve, reject) => {

        const start = Date.now();
        const api = new API()

        /** Define AIs to use */
        api.ais = ais ? ais.map( ai => {
            ai.api = api;
            return ai;
        }) : api.ais

        /** Handle data change */
        api.onDataChange = data => {

            /** Handle API data */
            const { action: { type, agent, options }, player } = data;
            steps++;
            //console.log(`Player ${player}(${agent}) should ${type}`)

            /** Handle response */
            switch (type) {
                case 'SELECT_PLAYER':
                    api.action(type, 'RAND')
                    break;
                case 'ROLL_DICE':
                    api.action(type, [Math.round(Math.random()), Math.round(Math.random()), Math.round(Math.random()), Math.round(Math.random())])
                    break;
                case 'MOVE':
                    api.action(type, api.ais[player].getBestOption(options))
                    break;
                case 'NO_MOVES_AVAILABLE':
                    api.action(type)
                    break;
                case 'UNKNOWN_ACTION':

                    /** Get winner */
                    const winner =
                        api.data.board[0][5][2] === 7 ? 0 :
                            api.data.board[2][5][2] === 7 ? 1 :
                                undefined;

                    /** Get time */
                    const finish = Date.now()
                    const passed = finish - start;

                    /** Log */
                    // console.log(`\nPlayer ${winner} won after ${passed}ms/${steps}steps\n`)
                    // console.log(
                    //     api.data.board.map((row, y) => {
                    //         return row.map((col, x) => {
                    //             [, p, c] = col;
                    //             return c ? `p:${p} n:${c}` : '_______'
                    //         }).join('|')
                    //     }).join('\n')
                    // )

                    if (winner === undefined) {
                        reject()
                    } else {
                        resolve({ winner })
                    }
                    break;
            }
        }

        let steps = 0;

        
        /** Set game mode */
        api.mode = [PlayerTypes.COMPUTER, PlayerTypes.COMPUTER]

        /** Run the game */
        api.delete()

    })
}


/** RunMultipleGames n */
function RunMultipleGames(n = 2, ais ) {
    const games = n;
    const time = Date.now()
    return new Promise((resolve, reject) => {
        const wins = [0, 0]
        const Run = (n) => {
            if( n > 0 ){
                RunGame(ais).then(({winner}) => wins[winner]++).then( () => Run(n-1) )
            }else{
                resolve({games, wins, ais, time:`${Date.now()-time}ms`})
            }
        }
        Run(n)
    })
}

/** Get / Set Best and default scoring table */
const DefaultScores = {...AIv0_0_DefaultScores};

function RunBatches(n = 1, BestScores = DefaultScores){

    if( typeof BestScores === 'string'){
        const BestScoresPath = `${__dirname}/${BestScores}`;
        if( fs.existsSync(BestScoresPath) ){
            BestScores = JSON.parse(fs.readFileSync( BestScoresPath, 'utf-8')); 
        }
    }

    return new Promise( (resolve, reject ) => {
        

        const Run = (n) => {

            const AdaptedScores = Object.keys(BestScores).reduce( (Scores,  key) => {
                Scores[key] = BestScores[key] + (Math.random()-0.5)
                return Scores
            }, {})
        
            const ais = [
                new AIv0_0(undefined,AI_Types.SMART, BestScores),
                new AIv0_0(undefined,AI_Types.SMART, AdaptedScores)
            ]

            RunMultipleGames(1000, ais ).then(data => {
            
                const {wins, ais} = data;
                const winner = wins[0] >= wins[1] ? 0 : 1;
                console.log({wins, winner})
        
                Object.keys(BestScores).forEach( key => {
                    BestScores[key] = ais[winner].scores[key]
                });
                console.log(JSON.stringify(BestScores) )
    
                if( n > 0 ){
                    Run(n-1)
                }else{
                    resolve({BestScores})
                }
        
            })
        }
        Run(n)

    
        
    })

    

}



function TestScores(Scores = [DefaultScores, BestScores]){

    if( typeof Scores[0] === 'string'){
        let path = `${__dirname}/${Scores[0]}`
        if( fs.existsSync(path) ){
            Scores[0] = JSON.parse(fs.readFileSync( path, 'utf-8')); 
        }
    }

    if( typeof Scores[1] === 'string'){
        
        let path = `${__dirname}/${Scores[1]}`
        if( fs.existsSync(path) ){
            Scores[1] = JSON.parse(fs.readFileSync( path, 'utf-8')); 
        }
    }

    return new Promise( (resolve, reject) => {
        RunMultipleGames(1000, [
            new AIv0_0(undefined, AI_Types.SMART, Scores[0]),
            new AIv0_0(undefined, AI_Types.SMART,  Scores[1])
        ]).then(data => {
            console.log(data)})
    })
}

//
//RunBatches(10, 'BestScores.1.json')

// TestScores([DefaultScores, 'BestScores.0.json'])
// TestScores([DefaultScores, 'BestScores.1.json'])
// TestScores([DefaultScores, 'BestScores.2.json'])
TestScores(['BestScores.1.json', 'BestScores.2.json'])
        



