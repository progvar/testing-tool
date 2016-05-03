'use strict'

const config = require('../config/config')
const events = require('events')
const util = require('util')
const Mocha = require('mocha')
const mocha = new Mocha({
    timeout : 50000
})


function testRunner(testFilePath) {
    const filePath = testFilePath || config.test

    config.logger.info('File path at testRunner: ', testFilePath)
    mocha.addFile(filePath)
    this.array = []
    this.output = {
        title : undefined,
        started : false,
        ended : false,
        passed : false,
        req : {},
        res : {}
    }
    events.EventEmitter.call(this)
    config.logger.info('Starting tests!')

    // Running the tests
    mocha.run()
    .on('test', test => {
        this.output.title = test.title
        this.output.started = true
    })
    .on('test end', test => {
        this.output.ended = true
        this.array.push({
            title : this.output.title,
            started : this.output.started,
            ended : this.output.ended,
            passed : this.output.passed,
            req : test.ctx.req,
            res : test.ctx.res,
            error : this.output.error || undefined
        })
        this.emit('update') // Causing an update event
    })
    .on('pass', () => {
        this.output.passed = true
        this.output.error = undefined
    })
    .on('fail', (test, err) => {
        this.output.passed = false
        this.output.error = err.toString()
    })
    .on('end', () => {
        this.emit('end')
    })
    // ^^Running the tests^^
}

util.inherits(testRunner, events.EventEmitter)

module.exports = testRunner
