const { json } = require("express");
const mongoose = require("mongoose");
//const bcrypt = require('bcrypt')
mongoose.set("debug", true);

const FashionSocial = mongoose.connection.useDb("FashionSocial");

const LikeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  targetId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
  },
  targetType: { // 'post' hoặc 'comment' để xác định kiểu đối tượng
    type: String,
    required: true,
    enum: ['post', 'comment'],
  },
  timeStamp: {
    type: Date,
    require: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const Like = FashionSocial.model("Like", LikeSchema);

module.exports = Like;
