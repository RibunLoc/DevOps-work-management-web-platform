const mongoose = require("mongoose");
//const bcrypt = require('bcrypt')
mongoose.set("debug", true);

const FashionSocial = mongoose.connection.useDb("FashionSocial");

const PetUserSchema = new mongoose.Schema({
  petId: {
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

const PetUser = FashionSocial.model("PetUser", PetUserSchema);

module.exports = PetUser;
