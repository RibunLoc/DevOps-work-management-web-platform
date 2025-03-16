const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
mongoose.set('debug', true)

const FashionSocial = mongoose.connection.useDb('FashionSocial');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    phone: {
        type: String,
        require: true,
        unique: true
    },
    firstname: {
        type: String,
        require: true,
    },
    lastname: {
        type: String,
        require: true,
    },
    avatar: {
        type: String,
        require: true,
    },
    location: {
        type: String,
        require: true,
    },
    createdAt: {
        type: Date
    },
    resetPasswordToken: {
        type: String,
        default: undefined
    },
    description: {
        type:String
    }
})

UserSchema.pre('save', async function () {
    try {
        const salt = await bcrypt.genSalt(10);

        this.password = await bcrypt.hash(this.password, salt);

    } catch (error) {
        return error;
    }
})



const User = FashionSocial.model('User', UserSchema)

module.exports = User








