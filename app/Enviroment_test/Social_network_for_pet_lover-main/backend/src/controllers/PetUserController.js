const PetUser = require("../models/PetUser");
const mongoose = require("mongoose");
const connectToDb = require("../config/database/db");
const { ObjectId } = require("mongodb");
mongoose.set("debug", true);

class PetUserController {
  //[POST]
  async create(req, res) {
    try {
      connectToDb();
      const { petId, userId } = req.body;
      console.log("sdkadhs", petId, userId);
      if (!userId || !petId) {
        return res
          .status(400)
          .json({ message: "Not enougddddh required information!" });
      }
      if (!ObjectId.isValid(userId) || !ObjectId.isValid(userId)) {
        return res
          .status(400)
          .send({ error: "Invalid userId, petId format", userId, petId });
      }
      const existingPetUser = await PetUser.findOne({
        petId: new ObjectId(`${petId}`),
        userId: new ObjectId(`${userId}`),
      });
      if (existingPetUser) {
        existingPetUser.updatedAt = new Date();
        existingPetUser.isDeleted = !existingPetUser.isDeleted ;
        await existingPetUser.save();
        return res.status(200).json({
          message: "Update petuser successfully",
          newPetUser: existingPetUser,
        });
      } else {
        const newPetUser = PetUser({
          userId: new ObjectId(`${userId}`),
          petId: new ObjectId(`${petId}`),
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
        });
        await newPetUser.save();
        return res.status(200).json({
          message: "Create petuser successfully",
          newPetUser: newPetUser,
        });
      }
    } catch (e) {
      console.log("Some error in registration. Try again!!", e);
    }
  }

  async getFavouritedPetsByUserId(req, res) {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      if (!ObjectId.isValid(userId)) {
        return res.status(400).send({ error: "Invalid userId format", userId });
      }
      connectToDb();
      const pets = await PetUser.aggregate([
        {
          $match: {
            userId: new ObjectId(`${userId}`),
            isDeleted: false,
          },
        },
        {
          $lookup: {
            from: "pets",
            localField: "petId", // Trường trong Post
            foreignField: "_id", // Trường trong User
            as: "petInfo", // Tên trường chứa kết quả nối
          },
        },
        {
          $unwind: {
            path: "$petInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "petInfo.userId", // Trường trong Post
            foreignField: "_id", // Trường trong User
            as: "ownerInfo", // Tên trường chứa kết quả nối
          },
        },
        {
          $unwind: {
            path: "$ownerInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "petusers",
            let: { petId: "$petInfo._id" }, // Tham chiếu đến petId
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$petId", "$$petId"] },
                      { $eq: ["$isDeleted", false] },
                    ],
                  },
                },
              },
              {
                $count: "followerCount", // Đếm số lượt follow
              },
            ],
            as: "followerData",
          },
        },
        {
          $addFields: {
           "petInfo.followerCount": {
              $ifNull: [{ $arrayElemAt: ["$followerData.followerCount", 0] }, 0],
            },
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $project: {
            _id: 1,
            "petInfo._id": 1,
            "petInfo.name": 1,
            "petInfo.bio": 1,
            "petInfo.profilePicture": 1,
            "petInfo.updatedAt": 1,
            "petInfo.height": 1,
            "petInfo.weight": 1,
            "petInfo.sex": 1,
            "petInfo.type": 1,
            "petInfo.breed": 1,
            "petInfo.birthday": 1,
            "petInfo.followerCount":1,
            "ownerInfo.firstname": 1,
            "ownerInfo.lastname": 1,
            "ownerInfo.location": 1,
            "ownerInfo.avatar": 1,
            "ownerInfo._id": 1,
          },
        },
      ]);
      if (pets.length > 0) res.status(200).send({ pets: pets });
      else res.status(200).send({ pets: [] });
    } catch (e) {
      console.log(e);
    }
  }
  async deletePetUserById(req, res) {
    try {
      const { petUserId } = req.query;
      if (!petUserId) {
        return res.status(400).json({ error: "petUserId is required" });
      }
      if (!ObjectId.isValid(petUserId)) {
        return res
          .status(400)
          .send({ error: "Invalid petUserId format", petUserId });
      }
      connectToDb();
      const updatedPetUser = await PetUser.findByIdAndUpdate(
        petUserId,
        { isDeleted: true, updatedAt: new Date() },
        { new: true }
      );

      if (updatedPetUser) {
        res.status(200).send({
          message: "Unsave pet successfully",
          deletedPetUser: updatedPetUser,
        });
      } else {
        res.status(400).send({ message: "PetUser relationship not found" });
      }
    } catch (e) {
      console.log(e);
      res.status(500).send({ message: "Server error" });
    }
  }
  async checkIfPetIsFavourite(req, res) {
    try {
      const { userId, petId } = req.query;
      const isSaved = await PetUser.findOne({
        userId: new ObjectId(`${userId}`),
        petId: new ObjectId(`${petId}`),
        isDeleted: false,
      });
      return res.status(200).send({ isSaved: isSaved !== null });
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}

module.exports = new PetUserController();
