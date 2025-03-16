const mongoose = require('mongoose')
//const bcrypt = require('bcrypt')
mongoose.set('debug', true)

const FashionSocial = mongoose.connection.useDb('FashionSocial');

const ImageSchema = new mongoose.Schema({
    type: {
        type: String,
        require: true,
    },
    senderEmail: {
        type: String,
        require: true,
    },
    recipentEmail: {
        type: String,
    },
    link: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    sendAt: {
        type: Date,
        require: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})


const Image = FashionSocial.model('Image', ImageSchema)

module.exports = Image








