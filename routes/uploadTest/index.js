'use strict'

const fs = require('fs')
const parse = require('co-busboy')
const path = require('path')

function *uploadTestFile() {
    let parts = parse(this)
    let part

    while (part = yield parts) { // eslint-disable-line no-cond-assign
        let stream = fs.createWriteStream(path.join('./test/', part.filename))

        part.pipe(stream)
        console.log('uploading %s -> %s', part.filename, stream.path)
        module.exports.path = stream.path
    }
    this.redirect('/')
}

module.exports = {
    uploadTestFile
}
