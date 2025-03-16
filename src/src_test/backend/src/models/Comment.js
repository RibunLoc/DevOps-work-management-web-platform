const mongoose = require('mongoose')
//const bcrypt = require('bcrypt')
mongoose.set('debug', true)

const FashionSocial = mongoose.connection.useDb('FashionSocial');

const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        default:null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isDeleted: {
        type:Boolean,
        required:true,
        default: false,
    }
})

const Comment = FashionSocial.model('Comment', CommentSchema)
module.exports = Comment








