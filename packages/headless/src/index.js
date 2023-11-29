
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

const { API, AI } = require('gour/dist')

const start = () => {
    const onDataChange = data => {
        console.log("data", data)
    }
    const api = new API(onDataChange)
    api.create()
}


async function main() {
    start()
    await new Promise(function () { });
}

function panic(error) {
    console.error(error);
    process.exit(1);
}

// https://stackoverflow.com/a/46916601/1478566
main().catch(panic).finally(clearInterval.bind(null, setInterval(a => a, 1E9)));