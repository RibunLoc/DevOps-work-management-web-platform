const mongoose = require('mongoose')
//const bcrypt = require('bcrypt')
mongoose.set('debug', true)

const FashionSocial = mongoose.connection.useDb('FashionSocial');

const FollowsSchema = new mongoose.Schema({
    followerId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
    },
    followingId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
    },
    dateTime: {
        type: Date,
        require: true
    },
    isDelete: {
        type:Boolean,
        require:true
    },
    // isIgnore: {
    //     type:Boolean,
    //     require:true
    // }
})



const Follow = FashionSocial.model('Follows', FollowsSchema)

module.exports = Follow








