const level = process.env.LOG_LEVEL || 'debug'
const yaml = require('yaml')
const fs = require('fs')
const path = require('path')

const createLogger = require('./lib/createLogger.js')

const data = fs.readFileSync(path.join(__dirname, './defaults.yml'), 'utf8')
const loggers = yaml.parse(data)

function createLog() {
    const Log = {}
    let date = Date.now()
    this.startTime = Date.now()
    for (let logger_name in loggers) {
        //console.log(logger_name)
        logger_opts = loggers[logger_name]
        Log[logger_name] = createLogger(logger_opts)
        Log[logger_name].startTime = this.startTime
    }

    return Log
}

module.exports = createLog()
