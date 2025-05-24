const mongoose = require("mongoose");
//const bcrypt = require('bcrypt')
mongoose.set("debug", true);

const FashionSocial = mongoose.connection.useDb("FashionSocial");

const PetPostSchema = new mongoose.Schema({
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
  isFavourite: {
    type: Boolean,
    default: false,
  },
});

const PetPost = FashionSocial.model("PetPost", PetPostSchema);

module.exports = PetPost;
