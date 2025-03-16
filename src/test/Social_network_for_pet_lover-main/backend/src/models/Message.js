const mongoose = require('mongoose')
//const bcrypt = require('bcrypt')
mongoose.set('debug', true)

const FashionSocial = mongoose.connection.useDb('FashionSocial');

const MessageSchema = new mongoose.Schema({
    senderEmail: {
        type: String,
        require: true,
    },

    recipentEmail: {
        type: String,
        require: true,
    },
    content: {
        type: String,
        require: true
    },
    sendAt: {
        type: Date,
        require: true,
    },
    image: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})


const Message = FashionSocial.model('Message', MessageSchema)

module.exports = Message








