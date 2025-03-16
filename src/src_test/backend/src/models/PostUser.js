const mongoose = require("mongoose");
//const bcrypt = require('bcrypt')
mongoose.set("debug", true);

const FashionSocial = mongoose.connection.useDb("FashionSocial");

const PostUserSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  createdAt: {
    type: Date,
    require: true,
  },
  updatedAt: {
    type: Date,
    require: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const PostUser = FashionSocial.model("PostUser", PostUserSchema);

module.exports = PostUser;
