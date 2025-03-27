const PostUser = require("../models/PostUser");
const mongoose = require("mongoose");
const connectToDb = require("../config/database/db");
const { ObjectId } = require("mongodb");
mongoose.set("debug", true);

class PostUserController {
  //[POST]
  async toggleSavePost(req, res) {
    try {
      connectToDb();
      const { postId, userId } = req.body;
      console.log("ddddd", postId, userId);
      if (!userId || !postId) {
        return res
          .status(400)
          .json({ message: "Not enougddddh required information!" });
      }

      if (!ObjectId.isValid(userId) || !ObjectId.isValid(userId)) {
        return res
          .status(400)
          .send({ error: "Invalid userId, petId format", userId, postId });
      }
      const existingPostUser = await PostUser.findOne({
        postId: new ObjectId(`${postId}`),
        userId: new ObjectId(`${userId}`),
      });
      if (existingPostUser) {
        existingPostUser.updatedAt = new Date();
        existingPostUser.isDeleted = !existingPostUser.isDeleted;
        await existingPostUser.save();
        return res.status(200).json({
          message: "Update postuser successfully",
          newPostUser: existingPostUser,
          isSaved: !existingPostUser.isDeleted
        });
      } else {
        const newPostUser = PostUser({
          userId: new ObjectId(`${userId}`),
          postId: new ObjectId(`${postId}`),
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
        });
        await newPostUser.save();
        return res.status(200).json({
          message: "Create postuser successfully",
          newPostUser: newPostUser,
          isSaved: newPostUser.isDeleted
        });
      }
    } catch (e) {
      console.log("Some error in registration. Try again!!", e);
    }
  }

  async getFavouritedPostsByUserId(req, res) {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      if (!ObjectId.isValid(userId)) {
        return res.status(400).send({ error: "Invalid userId format", userId });
      }
      connectToDb();
      const posts = await PostUser.aggregate([
        {
          $match: {
            userId: new ObjectId(`${userId}`),
            isDeleted: false,
          },
        },
        {
          $lookup: {
            from: "posts",
            localField: "postId", // Trường trong Post
            foreignField: "_id", // Trường trong User
            as: "postInfo", // Tên trường chứa kết quả nối
          },
        },
        {
          $unwind: {
            path: "$postInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "postInfo.userId", // Trường trong Post
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
            from: "follows", // Collection chứa thông tin followers
            let: { ownerId: "$ownerInfo._id" }, // Biến chứa giá trị _id của owner
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$followingId", "$$ownerId"] }, // Điều kiện liên kết
                      { $eq: ["$isDelete", false] }, // Chỉ lấy followers không bị xóa
                    ],
                  },
                },
              },
            ],
            as: "followersInfo",
          },
        },
        {
          $addFields: {
            "ownerInfo.followerCount": { $size: "$followersInfo" }, // Đếm số lượng followers
          },
        },
        {
          $lookup: {
            from: "likes", // Collection chứa thông tin likes
            let: { postId: "$postInfo._id" }, // Biến chứa giá trị _id của bài viết
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$targetId", "$$postId"] }, // Điều kiện liên kết với bài viết
                      { $eq: ["$isDeleted", false] }, // Chỉ lấy likes không bị xóa
                    ],
                  },
                },
              },
            ],
            as: "likesInfo", // Tên trường chứa kết quả nối
          },
        },
        {
          $addFields: {
            "postInfo.likeCount": { $size: "$likesInfo" }, // Đếm số lượng likes
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
            "postInfo._id": 1,
            "postInfo.title": 1,
            "postInfo.content": 1,
            "postInfo.images": 1,
            "postInfo.createdAt": 1,
            "postInfo.updatedAt": 1,
            "postInfo.isDeleted": 1,
            "postInfo.userId": 1,
            "postInfo.likeCount":1,
            "ownerInfo.firstname": 1,
            "ownerInfo.lastname": 1,
            "ownerInfo.location": 1,
            "ownerInfo.avatar": 1,
            "ownerInfo._id": 1,
            "ownerInfo.followerCount": 1,
          },
        },
      ]);
      if (posts.length > 0) res.status(200).send({ posts: posts });
      else res.status(200).send({ posts: [] });
    } catch (e) {
      console.log(e);
    }
  }
  async deletePostUserById(req, res) {
    try {
      const { postUserId } = req.query;
      if (!postUserId) {
        return res.status(400).json({ error: "postUserId is required" });
      }
      if (!ObjectId.isValid(postUserId)) {
        return res
          .status(400)
          .send({ error: "Invalid postUserId format", postUserId });
      }
      connectToDb();
      const updatedPostUser = await PostUser.findByIdAndUpdate(
        postUserId,
        { isDeleted: true, updatedAt: new Date() },
        { new: true }
      );

      if (updatedPostUser) {
        res.status(200).send({
          message: "Unsave post successfully",
          deletedPostUser: updatedPostUser,
        });
      } else {
        res.status(400).send({ message: "PetUser relationship not found" });
      }
    } catch (e) {
      console.log(e);
      res.status(500).send({ message: "Server error" });
    }
  }
}

module.exports = new PostUserController();
