'use strict'

const winston = require('winston')
const config = {}

config.port = process.env.PORT || 3000
config.test = process.env.TEST_ROUTE || './test/test.js'


if (process.env.HTTPS_PROXY) {
    config.use_proxy = 'true'
}

config.logger = new winston.Logger({
    transports : [
        new (winston.transports.Console)({
            level : 'info'
        }),
        new (winston.transports.File)({
            name : 'payloads',
            filename : 'payload.json',
            level : process.env.LOG_LEVEL || 'debug'
        })
    ]
})

module.exports = config
