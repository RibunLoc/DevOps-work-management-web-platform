const mongoose = require('mongoose')
//const bcrypt = require('bcrypt')
mongoose.set('debug', true)

const FashionSocial = mongoose.connection.useDb('FashionSocial');

const PetSchema = new mongoose.Schema({
    name: {//
        type: String,
        require: true,
    },
    bio: {//
        type: String,
        require: true,
    },
    profilePicture: {//
        type: String,
        default:"default"
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        require: true
    },
    sex:{ //
        type:String,
        default:"undefine"
    },
    height:{
        type:String,
        default: "0"
    },
    weight:{
        type:String,
        default: "0"
    },
    createdAt: {
        type: Date,
        require: true,
    },
    updatedAt: {
        type: Date,
        require: true,
    },
    type: {//
        type:String,
        require:true
    },
    breed:{//
        type:String,
    },
    birthday:{//
        type:String,
    },
    isDeleted: {
        type: Boolean,
        default: true
    },
})



const Pet = FashionSocial.model('Pet', PetSchema)

module.exports = Pet








