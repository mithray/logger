const logRequire = require('./lib/logRequire.js')

async function load() {
    const changeCase = logRequire('change-case')
    let smh = changeCase.paramCase('hi my friend!')
    console.log(smh)
    return smh
}
load()
