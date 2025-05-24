require('dotenv').config()

const mongoose = require('mongoose')

async function connectToDb() {

    const uri = process.env.DB_URI


    await mongoose.connect(uri, {
    })
        .then(() => {
            console.log("successfully connected")
        })
        .catch((err) => {
            console.log(err)
        })
}

module.exports = connectToDb