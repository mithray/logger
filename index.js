const logRequire = require('./lib/logRequire.js')
const Songshu = logRequire('songshu')
const songshu = new Songshu()
const yaml = logRequire('yaml')
const level = process.env.LOG_LEVEL || 'debug'
const fs = logRequire('fs')
const path = logRequire('path')
const prettyMilliseconds = logRequire('pretty-ms')
const testLib = logRequire('./lib/testlib/index.js')

const createLogger = logRequire('./lib/createLogger.js')

const data = fs.readFileSync(path.join(__dirname, './defaults.yml'), 'utf8')
const loggers = yaml.parse(data)

function createLog() {
    const Log = {}
    /*
    let date = Date.now()
    this.startTime = Date.now()
    */
    let uptime = process.uptime() * 1000
    process.env.LOGGER_START_TIME = uptime
    for (let logger_name in loggers) {
        //console.log(logger_name)
        logger_opts = loggers[logger_name]
        Log[logger_name] = createLogger(logger_opts)
        //        Log[logger_name].startTime = this.startTime
    }

    return Log
}

module.exports = createLog()
