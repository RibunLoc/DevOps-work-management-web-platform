const mongoose = require('mongoose')
//const bcrypt = require('bcrypt')
mongoose.set('debug', true)

const FashionSocial = mongoose.connection.useDb('FashionSocial');

const ConversationSchema = new mongoose.Schema({
    participant: {
        type: [String],
        require: true,
    },
    image: {
        type: String,
        require: true
    },
    theme: {
        type: [[Number]],
        require: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})


const Conversation = FashionSocial.model('Conversation', ConversationSchema)

module.exports = Conversation








