const c = require('ansi-colors')
const moment = require('moment')
const _ = require('lodash')
const stripAnsi = require('strip-ansi')
const md = require('@mithray/md-terminal')
const pjson = require('prettyjson-256')
const prettyMilliseconds = require('pretty-ms')

const original_stdout = _.cloneDeep(process.stdout)
const original_stderr = _.cloneDeep(process.stderr)
function setProcess(std, options) {
    let elapsedTimeHuman = this.elapsedTimeHuman
    let originalWrite = std.write
    let timeStart = ''
    let timeRelative = ''
    std.write = function(chunk, encoding, callback) {
        var prefix = ''
        if (options.markdown) {
            chunk = color(chunk)
        }
        if (options.highlight_paths) {
            chunk = chunk.replace(/\(.*\)/g, highlightPathSection)
        }
        try {
            if (options.timestamp_relative) {
                timeRelative += c.bgBlackBright(elapsedTimeHuman)
            }
        } catch {}
        try {
            if (options.timestamp) {
                //let currentTime = moment().format('YYYY-MM-D H:m:s')
                let currentTime = moment().format(options.timestamp)
                timeStart = c.bgBlackBright(currentTime)
            }
        } catch {}
        chunk = `${timeStart} ${timeRelative}: ${chunk}`
        originalWrite.call(std, chunk, encoding, callback)
    }

    return std
}
function logBase(options) {
    let logger = function(content) {
        setElapsedTime()
        process.stdout = setProcess(process.stdout, options)
        try {
            console.log(c[options.importance](content))
        } catch (e) {
            console.log(content)
        }
        process.stdout.write = original_stdout.write
        //        elapsedTime = th
    }
    return logger
}
/*
 */
function setElapsedTime() {
    this.elapsedTime = Date.now() - this.startTime
    this.elapsedTimeHuman = prettyMilliseconds(elapsedTime)
}
function errorBase(options) {
    let logger = function(content) {
        setElapsedTime()
        process.stderr = setProcess(process.stderr, options)
        console.error(c.danger(content))
        process.stderr.write = original_stderr.write
    }
    return logger
}

function traceBase(options) {
    let logger = function(content) {
        setElapsedTime()
        let message = content ? content : ''
        process.stderr = setProcess(process.stderr, options)
        console.trace(message)
        process.stderr.write = original_stderr.write
    }
    return logger
}
function tableBase(options) {
    let logger = function(content) {
        setElapsedTime()
        process.stdout = setProcess(process.stdout, options)
        console.table(content)
        process.stdout.write = original_stdout.write
    }
    return logger
}
function warnBase(options) {
    let logger = function(content) {
        setElapsedTime()
        process.stderr = setProcess(process.stderr, options)
        console.warn(c.warning(content))
        process.stderr.write = original_stderr.write
    }
    return logger
}
function infoBase(options) {
    let logger = function(content) {
        setElapsedTime()
        process.stdout = setProcess(process.stdout, options)
        console.info(c.info(content))
        process.stdout.write = original_stdout.write
    }
    return logger
}

function createLogger(options) {
    //    console.log('self.startTime')
    /*
    console.log(this.elapsedTimeHuman)
        this.startTime = this[options.base_logger].startTime
        let elapsedTime = Date.now() - this.startTime
        this.elapsedTimeHuman = prettyMilliseconds(elapsedTime, {
            compact: true
        })
        console.log(this.startTime)
        */
    let logger

    switch (options.base_logger) {
        case 'log':
            logger = logBase(options)
            break
        case 'error':
            logger = errorBase(options)
            break
        case 'trace':
            logger = traceBase(options)
            break
        case 'table':
            logger = tableBase(options)
            break
        case 'warn':
            logger = warnBase(options)
            break
        case 'info':
            logger = infoBase(options)
            break
        default:
            logger = logBase(options)
    }

    return logger
}

c.theme({
    danger: c.red,
    dark: c.dim.gray,
    disabled: c.gray,
    em: c.italic,
    strong: c.bold,
    em2: c.italic.green,
    strong2: c.bold.green,
    success: c.green,
    primary: c.blue,
    heading: c.bold.underline,
    info: c.cyan,
    muted: c.dim,
    underline: c.underline,
    warning: c.yellow
})
function highlightPaths(match, p1, p2, p3) {
    let out = c.yellow(p1) + c.yellow.bold(p2) + c.yellow(p3)
    return out
}
function highlightPathSection(match, p1, p2) {
    let out
    out = match.replace(/(.*:)([0-9]*:[0-9]*)(.*)/gms, highlightPaths)
    return out
}
function boldenize(str) {
    return c.bold(str)
}
function italicize(str) {
    return c.italic(str)
}
function colorize(str) {
    return c.green(str)
}
function em1(match, p1, p2) {
    let str = c.em(p1)
    return str
}
function em2(match, p1, p2) {
    let str = c.em2(p1)
    return str
}
function strong1(match, p1, p2) {
    let str = c.strong(p1)
    return str
}
function strong2(match, p1, p2) {
    let str = c.strong2(p1)
    return str
}
function strikethrough(match, p1, p2) {
    let str = c.strikethrough(p1)
    return str
}
function color(str) {
    str = str.replace(/\*\*(.+?)\*\*/g, strong2)
    str = str.replace(/__(.+?)__/g, em2)
    str = str.replace(/\*(.+?)\*/, strong1)
    str = str.replace(/_(.+?)_/g, em1)
    str = str.replace(/~~(.+?)~~/g, strikethrough)
    /*
    str = str.replace(/()/,)
    str = str.replace(/()/,)
    str = str.replace(/()/,)*/
    return str
}
module.exports = createLogger
