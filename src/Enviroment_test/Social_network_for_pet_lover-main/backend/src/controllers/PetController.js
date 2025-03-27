const PetUser = require("../models/PetUser");
const Pet = require("../models/Pet");
const mongoose = require("mongoose");
const connectToDb = require("../config/database/db");
const { ObjectId } = require("mongodb");
mongoose.set("debug", true);

class PetController {
  //[POST]
  async create(req, res) {
    try {
      connectToDb();
      const {
        userId,
        name,
        bio,
        type,
        breed,
        profilePicture,
        sex,
        birthday,
        height,
        weight,
      } = req.body;
      if (!userId || !name || !bio || !height || !weight || !type) {
        return res
          .status(400)
          .json({ message: "Not enough required information!" });
      }
      if (!ObjectId.isValid(userId)) {
        return res.status(400).send({ error: 'Invalid userId format',userId });
    }
      const newPet = Pet({
        name: name,
        bio: bio,
        profilePicture: profilePicture,
        userId: userId,
        sex: sex,
        height: height,
        weight: weight,
        type: type,
        breed: breed,
        birthday: birthday,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      });
      await newPet.save();

      return res.status(200).json({
        message: "Create pet successfully",
        newPet: newPet,
      });
    } catch (e) {
      console.log("Some error in registration. Try again!!", e);
    }
  }

  async updateById(req, res) {
    try {
      const {
        petId,
        name,
        bio,
        type,
        breed,
        profilePicture,
        sex,
        birthday,
        height,
        weight,
      } = req.body;
      
      if (
        !petId ||
        !name ||
        !bio ||
        !height ||
        !weight ||
        !type ||
        !breed ||
        !profilePicture ||
        !birthday ||
        !sex
      ) {
        return res
          .status(400)
          .json({ message: "Not enough required information!" });
      }
      
      connectToDb();
      const updatedPet = await Pet.findByIdAndUpdate(
        petId,
        {
          name: name,
          bio: bio,
          type: type,
          breed: breed,
          profilePicture: profilePicture,
          sex: sex,
          birthday: birthday,
          height: height,
          weight: weight,
          updatedAt: new Date(),
        },
        { new: true }
      );

      if (updatedPet) {
        res.status(200).send({
          message: "Pet updated successfully",
          updatedPet: updatedPet,
        });
      } else {
        res.status(400).send({ message: "Pet not found" });
      }
    } catch (e) {
      console.log(e);
      res.status(500).send({ message: "Server error" });
    }
  }

  async getPetsByUserId(req, res) {
    try {
      const {userId} = req.query;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      if (!ObjectId.isValid(userId)) {
        return res.status(400).send({ error: 'Invalid userId format',userId });
    }
      connectToDb();
      const pets = await Pet.aggregate([
        {
          $match: {
            userId: new ObjectId(`${userId}`),
            isDeleted: false,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId", // Trường trong Post
            foreignField: "_id", // Trường trong User
            as: "userInfo", // Tên trường chứa kết quả nối
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            bio: 1,
            profilePicture: 1,
            userId: 1,
            updatedAt: 1,
            height: 1,
            weight: 1,
            sex: 1,
            type: 1,
            breed: 1,
            birthday: 1,
            "userInfo.lastname": 1,
            "userInfo.firstname": 1,
            "userInfo.avatar": 1,
          },
        },
      ]);
      
      return res.json({ pets });
    } catch (e) {
      console.log(e);
    }
  }
  // async getFavouritedPetsByUserId(req, res) {
  //   try {
  //     const {userId} = req.query;
  //     if (!userId) {
  //       return res.status(400).json({ error: "userId is required" });
  //     }
  //     if (!ObjectId.isValid(userId)) {
  //       return res.status(400).send({ error: 'Invalid userId format',userId });
  //   }
  //     connectToDb();
  //     const pets = await PetUser.aggregate([
  //       {
  //         $match: {
  //           userId: new ObjectId(`${userId}`),
  //           isDeleted: false,
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "pets",
  //           localField: "petId", // Trường trong Post
  //           foreignField: "_id", // Trường trong User
  //           as: "petInfo", // Tên trường chứa kết quả nối
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "users",
  //           localField: "petInfo.userId", // Trường trong Post
  //           foreignField: "_id", // Trường trong User
  //           as: "ownerInfo", // Tên trường chứa kết quả nối
  //         },
  //       },
  //       {
  //         $sort: {
  //           createdAt: -1,
  //         },
  //       },
  //       {
  //         $project: {
  //           _id: 1,
  //           "petInfo._id": 1,
  //           "petInfo.name": 1,
  //           "petInfo.bio": 1,
  //           "petInfo.profilePicture": 1,
  //           "petInfo.updatedAt": 1,
  //           "petInfo.height": 1,
  //           "petInfo.weight": 1,
  //           "petInfo.sex": 1,
  //           "petInfo.type": 1,
  //           "petInfo.breed": 1,
  //           "petInfo.birthday": 1,
  //           "ownerInfo.lastname": 1,
  //           "ownerInfo.firstname": 1,
  //           "ownerInfo.avatar": 1,
  //           "ownerInfo._id": 1,
  //         },
  //       },
  //     ]);
  //     if(pets.length>0)
  //     return res.json.status(200)({pets});
  //   else return res.json.status(404)([])
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }
  async deletePetById(req, res) {
    try {
      const { petId } = req.query;
      if (!petId) {
        return res.status(400).json({ error: "petId is required" });
      }
      if (!ObjectId.isValid(petId)) {
        return res.status(400).send({ error: 'Invalid petId format',petId });
    }
      connectToDb();
      const updatedPet = await Pet.findByIdAndUpdate(
        petId,
        { isDeleted: true, updatedAt: new Date() },
        { new: true }
      );

      if (updatedPet) {
        res.status(200).send({
          message: "Pet deleted successfully",
          deletedPet: updatedPet,
        });
      } else {
        res.status(400).send({ message: "Pet not found" });
      }
    } catch (e) {
      console.log(e);
      res.status(500).send({ message: "Server error" });
    }
  }
  async 
}

module.exports = new PetController();
