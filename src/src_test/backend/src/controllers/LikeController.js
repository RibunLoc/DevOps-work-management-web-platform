const mongoose = require("mongoose");
const connectToDb = require("../config/database/db");
const Like = require("../models/Like");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const { ObjectId } = require("mongodb");
mongoose.set("debug", true);

class LikeController {
  async createLikePost(req, res) {
    try {
      await connectToDb();
      const { userId, targetId, targetType } = req.body;
      //console.log("userId,xcxc targetId, targetType", userId, targetId, targetType);
      if (!userId || !targetId || !targetType) {
        return res
          .status(400)
          .json({ message: "Not enough required information!" });
      }
      if (!ObjectId.isValid(userId)) {
        return res.status(400).send({ error: "Invalid userId format", userId });
      }
      const likeExisting = await Like.findOne({
        userId: new ObjectId(`${userId}`),
        targetId: new ObjectId(`${targetId}`),
        targetType: targetType,
      });

      if (likeExisting) {
        likeExisting.isDeleted = !likeExisting.isDeleted;
        likeExisting.timeStamp = new Date();
        await likeExisting.save();
      } else {
        const newLike = Like({
          userId: new ObjectId(`${userId}`),
          targetId: new ObjectId(`${targetId}`),
          targetType: targetType,
          timeStamp: new Date(),
        });
        await newLike.save();
      }
      if (targetType === "post") {
        const post = await Post.aggregate([
          {
            $match: {
              _id: new ObjectId(`${targetId}`),
              isDeleted: false,
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
            $unwind: {
              path: "$userInfo",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "likes",
              localField: "_id",
              foreignField: "targetId",
              as: "likesInfo",
            },
          },
          {
            $addFields: {
              likesInfo: {
                $filter: {
                  input: "$likesInfo", // Dữ liệu cần lọc
                  as: "like", // Biến đại diện cho từng phần tử trong mảng
                  cond: { $eq: ["$$like.isDeleted", false] }, // Điều kiện lọc
                },
              },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "likesInfo.userId",
              foreignField: "_id",
              as: "likedUserInfo",
            },
          },
          {
            $addFields: {
              isLiked: {
                $in: [new ObjectId(`${userId}`), "$likesInfo.userId"], // Kiểm tra nếu userId có trong mảng likeInfo
              },
            },
          },
          {
            $project: {
              _id: 1,
              title: 1,
              content: 1,
              images: 1,
              createdAt: 1,
              userId: 1,
              "userInfo.lastname": 1,
              "userInfo.firstname": 1,
              "userInfo._id": 1,
              "userInfo.avatar": 1,
              "userInfo.email": 1,
              "likedUserInfo.lastname": 1,
              "likedUserInfo.firstname": 1,
              "likedUserInfo._id": 1,
              "likedUserInfo.email": 1,
              //likesInfo:1,
              isLiked: 1,
            },
          },
        ])
        return res.status(200).json({
          message: "update like successfully",
          updatedPost: post[0],
        });
        
      } else {
        const comment = await Comment.aggregate([
          { $match: { _id: new ObjectId(`${targetId}`) } },
          {
            $graphLookup: {
              from: "comments", // Tên collection
              startWith: "$_id", // Bắt đầu từ chính comment hiện tại
              connectFromField: "_id", // Liên kết từ _id
              connectToField: "parentId", // Kết nối với parentId
              as: "replies", // Tên mảng chứa các trả lời
            },
          },
          {
            $lookup: {
              from: "users",
              foreignField: "_id",
              localField: "userId",
              as: "userInfo",
            },
          },
          {
            $lookup: {
              from: "likes",
              localField: "_id",
              foreignField: "targetId",
              as: "likeInfo",
            },
          },
          {
            $addFields: {
              userInfo: {
                $let: {
                  vars: { user: { $arrayElemAt: ["$userInfo", 0] } }, // Lấy user đầu tiên
                  in: {
                    firstname: "$$user.firstname", // Chỉ lấy thuộc tính name
                    lastname: "$$user.lastname",
                    avatar: "$$user.avatar", // Nếu cần thêm thuộc tính, bạn có thể thêm ở đây
                  },
                },
              },
              likedUserInfo: {
                $filter: {
                  input: "$likeInfo", // Dữ liệu cần lọc
                  as: "like", // Biến đại diện cho từng phần tử trong mảng
                  cond: { $eq: ["$$like.isDeleted", false] }, // Điều kiện lọc
                },
              },
              isLiked: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$likeInfo", // Dữ liệu cần lọc
                      as: "like", // Biến đại diện cho từng phần tử trong mảng
                      cond: {
                        $and: [
                          { $eq: ["$$like.userId", new ObjectId(`${userId}`)] },
                          { $eq: ["$$like.isDeleted", false] },
                        ],
                      }, // Điều kiện lọc
                    },
                  },
                  0,
                ],
              },
            },
          },
          {
            $sort: { createdAt: -1 }, // Sắp xếp giảm dần theo ngày tạo
          },
        ]).then((results) => results[0]);
        return res.status(200).json({
          message: "update like comment successfully",
          updatedComment: comment,
        });
      }
    } catch (e) {
      console.log("Some error in registration. Try again!!", e);
      return res.status(404).json({
        message: "Have some errors",
      });
    }
  }
}
module.exports = new LikeController();
