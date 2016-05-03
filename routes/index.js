'use strict'

const Router = require('koa-router')

const UploadTestFile = new Router()

UploadTestFile.post('/', require('./uploadTest').uploadTestFile)


module.exports = {
    UploadTestFile
}


