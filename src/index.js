'use strict'

const config = require('../config/config')
const path = require('path')
const WebSocketServer = require('ws').Server
const http = require('http')
const app = require('koa')()
const staticServe = require('koa-static')
const router = require('../routes')
const bodyParser = require('koa-bodyparser')

const TestRunner = require('./testRunner')

app.use(bodyParser())
app.use(staticServe(path.join(__dirname, '../view')))
app.use(router.UploadTestFile.routes())

const server = require('http').createServer(app.callback())
const wss = new WebSocketServer({ server })

wss.on('connection', socket => {
    config.logger.info('A user has connected to the Web Socket Server!')
    const updater = new TestRunner(require('../routes/uploadTest').path) // eslint-disable-line global-require

    updater.setMaxListeners(Infinity)
    socket.on('close', () => {
        config.logger.info('A user has disconnected from the Web Socket Server!')
    })

    updater.on('update', () => {
        socket.send(JSON.stringify(updater.array[updater.array.length - 1]))
    })

    updater.on('end', () => {
        socket.send('update_finished')
        config.logger.info('Tests finished on the server!\n\n\n')
    })
})

server.listen(config.port, () => {
    config.logger.info('Listening on port ' + config.port + '!')
})
