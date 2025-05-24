const mongoose = require('mongoose')
//const bcrypt = require('bcrypt')
mongoose.set('debug', true)

const FashionSocial = mongoose.connection.useDb('FashionSocial');

const EventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    dateTime: {
        type: Date,
        require: true
    },
    imageUrl: {
        type: String,
        require: true,
    },
    location: {
        type:String,
        require: true
    },
    createdBy: {
        type: String,
        require: true
    },
    createdAt: {
        type:Date,
        require: true
    },
    isDelete: {
        type:Boolean,
        require:true
    }
})



const Event = FashionSocial.model('Event', EventSchema)

module.exports = Event








