const mongoose = require("mongoose");
//const bcrypt = require('bcrypt')
mongoose.set("debug", true);

const FashionSocial = mongoose.connection.useDb("FashionSocial");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
  images: [{ type: String }],
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

const Post = FashionSocial.model("Post", PostSchema);

module.exports = Post;
