
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

const { API, PlayerTypes } = require('gour/dist');


function game() {
    return new Promise((resolve, reject) => {

        const start = Date.now();
        const api = new API()

        let steps = 0;

        /** Handle API data */
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
                    api.action(type, api.ai.getBestOption(options))
                    break;
                case 'NO_MOVES_AVAILABLE':
                    api.action(type)
                    break;
                case 'UNKNOWN_ACTION':

                    /** Cleanup */
                    localStorage.clear()

                    /** Get winner */
                    const winner =
                        api.data.board[0][5][2] === 7 ? 0 :
                            api.data.board[2][5][2] === 7 ? 1 :
                                undefined;

                    /** Get time */
                    const finish = Date.now()
                    const passed = finish - start;

                    /** Log */
                    console.log(`\nPlayer ${winner} won after ${passed}ms/${steps}steps\n`)
                    console.log(
                        api.data.board.map((row, y) => {
                            return row.map((col, x) => {
                                [, p, c] = col;
                                return c ? `p:${p} n:${c}` : '_______'
                            }).join('|')
                        }).join('\n')
                    )

                    if (winner === undefined) {
                        reject()
                    } else {
                        resolve({ winner })
                    }
                    break;
            }
        }

        /** Set game mode */
        api.mode = [PlayerTypes.COMPUTER, PlayerTypes.COMPUTER]

        /** Run the game */
        api.delete()

    })
}


/** Run n games */
function run_games(n = 3) {
    return new Promise((resolve, reject) => {
        const wins = [0, 0]
        const run = (n) => {
            if( n > 0 ){
                game().then(({winner}) => wins[winner]++).then( () => run(n-1) )
            }else{
                resolve(wins)
            }
        }
        run(n)
    })
}
        


run_games().then(data => console.log(data))
