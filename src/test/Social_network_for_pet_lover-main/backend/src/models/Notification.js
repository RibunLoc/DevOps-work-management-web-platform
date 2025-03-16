const mongoose = require('mongoose')
//const bcrypt = require('bcrypt')
mongoose.set('debug', true)

const FashionSocial = mongoose.connection.useDb('FashionSocial');

const NotificationSchema = new mongoose.Schema({
    postOwnerEmail: {
        type: String,
        require: true
    },
    eventType: {
        type: String,
        require: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
    },
    createdAt: {
        type: Date,
        require: true
    },
    userName: {
        type: String,
        require: true,
    },
    userAvatar: {
        type:String,
        require: true
    },
    isDelete: {
        type:Boolean,
        require:true
    }
})



const Notification = FashionSocial.model('Notification', NotificationSchema)

module.exports = Notification








