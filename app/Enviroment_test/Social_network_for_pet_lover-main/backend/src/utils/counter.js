const mongoose = require('mongoose')

let id = 1000

const getNextId = () => {
    id = id + 1
    return id
}

module.exports = getNextId()
