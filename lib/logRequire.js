const changeCase = require('change-case')
const c = require('ansi-colors')
const cliSpinners = require('cli-spinners')
const logUpdate = require('log-update')
const ms = require('pretty-ms')
const frames = cliSpinners.dots3.frames
const path = require('path')

let i = 0
function time(req) {
    if (req.completed) {
        return req.time
    } else {
        req.time = process.uptime() * 1000
        return req.time
    }
}
function update(req_arr) {
    const frame = c.green(frames[(i = ++i % frames.length)])
    let message = ''
    completed_frame = c.green('✔')
    for (req of req_arr) {
        if (req.completed) {
            message += `\n\t${completed_frame} Loaded module ${c.bold(
                req.name
            )} in ${ms(time(req))}`
        } else {
            message += `\n\t${frame} Loading module ${c.bold(
                req.name
            )} for ${ms(time(req))}`
        }
    }
    logUpdate('\t' + message.trim())
}
function logRequire(requisiteArray) {
    requisiteArray = [requisiteArray]
    req_arr = []
    let res = []
    let interval = setInterval(() => {
        update(req_arr)
    }, 40)
    for (let idx in requisiteArray) {
        let requisite = requisiteArray[idx]
        //console.time(requisite)
        obj = {
            name: requisite,
            completed: false,
            time: process.uptime() * 1000
        }
        req_arr.push(obj)
        if (!path.isAbsolute(requisite) && !requisite.match(/^[a-z0-9]+/i)) {
            requisite = path.join(process.mainModule.path, requisite)
        }
        let toEval
        //        if (requisite === '/home/raymond/backup/mithray/createLogger.js') {
        //      }
        try {
            toEval = `require('${requisite}')`
            evaled = eval(toEval)
        } catch {
            requisite = path.resolve(
                process.env.LOGGER_LAST_MODULE_REFERENCE,
                requisite
            )
            toEval = `require('${requisite}')`
        }
        process.env.LOGGER_LAST_MODULE_REFERENCE = requisite
        res.push(evaled)

        //console.log(i)
        /*
         */
        setTimeout(() => {}, 20)
        let completed_all = true
        req_arr[idx].completed = true
        update(req_arr)
        for (let req of req_arr) {
            if (req.completed === false) {
                completed_all = false
                break
            }
        }
        if (completed_all) {
            clearInterval(interval)
            logUpdate.done()
        }

        /*
            //console.timeEnd(requisite)
        }, Math.random() * 2000)
        */
    }
    if (res.length === 1) {
        res = res[0]
    }
    return res
}

module.exports = logRequire
