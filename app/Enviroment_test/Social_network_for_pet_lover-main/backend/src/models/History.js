const mongoose = require('mongoose')
mongoose.set('debug', true)

const FashionSocial = mongoose.connection.useDb('FashionSocial');

const HistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,  
    },
    type: {
        type: String,
        enum: ['search', 'delete', 'edit'],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isDeleted: {
        type:Boolean,
        default:false
    }
})

const History = FashionSocial.model('History', HistorySchema)
module.exports = History
