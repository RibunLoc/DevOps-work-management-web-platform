const Post = require("../models/Post");
const mongoose = require("mongoose");
const connectToDb = require("../config/database/db");
const { ObjectId } = require("mongodb");
const User = require("../models/User");
const PostUser = require("../models/PostUser");
const Follow = require("../models/Follow");
mongoose.set("debug", true);

class PostController {
  //[POST]
  async create(req, res) {
    try {
      connectToDb();
      const { userId, title, content, imgUrl } = req.body;
      if (!userId || !title || !content) {
        return res
          .status(400)
          .json({ message: "Not enough required information!" });
      }
      const newPost = Post({
        userId: new ObjectId(`${userId}`),
        title: title,
        content: content,
        images: imgUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDelete: false,
      });
      await newPost.save();

      return res.status(200).json({
        message: "create post successfully",
        newpost: newPost,
      });
    } catch (e) {
      console.log("Some error in registration. Try again!!", e);
    }
  }

  async getAllPost(req, res) {
    try {
      connectToDb();
      const { userId } = req.query;
      const posts = await Post.aggregate([
        {
          $match: {
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
            as: "likeInfo",
          },
        },
        {
          $addFields: {
            likeInfo: {
              $filter: {
                input: "$likeInfo", // Dữ liệu cần lọc
                as: "like", // Biến đại diện cho từng phần tử trong mảng
                cond: { $eq: ["$$like.isDeleted", false] }, // Điều kiện lọc
              },
            },
            isLiked: {
              $gt: [
                {
                  $size: {
                    $filter: {
                      input: "$likeInfo",
                      as: "like",
                      cond: {
                        $and: [
                          { $eq: ["$$like.userId", new ObjectId(`${userId}`)] },
                          { $eq: ["$$like.isDeleted", false] },
                        ],
                      },
                    },
                  },
                },
                0,
              ],
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "likeInfo.userId",
            foreignField: "_id",
            as: "likedUserInfo",
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
            userInfo: 1,
            "likedUserInfo.lastname": 1,
            "likedUserInfo.firstname": 1,
            "likedUserInfo._id": 1,
            "likedUserInfo.avatar": 1,
            isLiked: 1,
          },
        },
      ]);

      const postExplores = posts.length > 0 ? posts : [];
      res.json({
        recommentPost: postExplores,
      });
    } catch (e) {
      console.log(e);
    }
  }
  async getPostsByUserId(req, res) {
    try {
      const { targetId, userAccessId } = req.query;
      if (!ObjectId.isValid(targetId) && !ObjectId.isValid(userAccessId)) {
        return res.status(400).send({
          error: "Invalid userAccessId, targetId format",
          targetId,
          userAccessId,
        });
      }
      connectToDb();

      const user = await User.findById(targetId, { avatar: 1 });
      const posts = await Post.aggregate([
        {
          $match: {
            userId: new ObjectId(`${targetId}`),
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
            as: "likeInfo",
          },
        },
        {
          $addFields: {
            likeInfo: {
              $filter: {
                input: "$likeInfo", // Dữ liệu cần lọc
                as: "like", // Biến đại diện cho từng phần tử trong mảng
                cond: { $eq: ["$$like.isDeleted", false] }, // Điều kiện lọc
              },
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "likeInfo.userId",
            foreignField: "_id",
            as: "likedUserInfo",
          },
        },
        {
          $lookup: {
            from: "postusers", // Tên collection của PostUser
            let: { postId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$postId", "$$postId"] },
                      { $eq: ["$userId", new ObjectId(`${userAccessId}`)] },
                      { $eq: ["$isDeleted", false] },
                    ],
                  },
                },
              },
            ],
            as: "savedInfo",
          },
        },
        {
          $lookup: {
            from: "postusers", // Tên collection của PostUser
            let: { postId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$postId", "$$postId"] },
                      { $eq: ["$userId", new ObjectId(`${userAccessId}`)] },
                      { $eq: ["$isDeleted", false] },
                    ],
                  },
                },
              },
            ],
            as: "userAccessSaved",
          },
        },
        {
          $lookup: {
            from: "likes", // Tên collection chứa thông tin 'Like'
            let: { targetId: "$_id" }, // Lấy _id của Post để dùng trong điều kiện nối
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$targetId", "$$targetId"] }, // So sánh targetId trong Like với _id trong Post
                      { $eq: ["$userId", new ObjectId(`${userAccessId}`)] }, // Lọc theo userId
                      { $eq: ["$targetType", "post"] }, // Chỉ lấy dữ liệu 'Like' cho bài viết (post)
                      { $eq: ["$isDeleted", false] }, // Không lấy các like đã bị xóa
                    ],
                  },
                },
              },
            ],
            as: "userAccessLiked", // Tên trường chứa kết quả nối
          },
        },
        {
          $addFields: {
            isSaved: { $gt: [{ $size: "$userAccessSaved" }, 0] }, // Nếu có dữ liệu trong savedInfo, isSaved sẽ là true
            isLiked: { $gt: [{ $size: "$userAccessLiked" }, 0] }, // Nếu có dữ liệu trong savedInfo, isSaved sẽ là true
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
            userInfo: 1,
            //likedUserInfo: { $arrayElemAt: ["$likedUserInfo", 0] },
            "likedUserInfo.lastname": 1,
            "likedUserInfo.firstname": 1,
            "likedUserInfo._id": 1,
            "likedUserInfo.avatar": 1,
            isSaved: 1,
            isLiked: 1,
          },
        },
      ]);
      res.status(200).json({ posts: posts, user: user });
    } catch (e) {
      console.log(e);
    }
  }

  async getPostsByFollowedUsers(req, res) {
    try {
      const { userId, page, limit } = req.query;
      //console.log(userId,page,limit)
      const pageNum = parseInt(page); // Chuyển page thành số nguyên
      const limitNum = parseInt(limit); // Chuyển limit thành số nguyên

      if (
        !ObjectId.isValid(userId) ||
        isNaN(pageNum) ||
        pageNum <= 0 ||
        isNaN(limitNum) ||
        limitNum <= 0
      ) {
        return res
          .status(400)
          .send({ error: "Invalid input parameters", userId, page, limit });
      }
      connectToDb();
      const skip = (page - 1) * limit;
      const followedUsers = await Follow.find(
        {
          followerId: new ObjectId(`${userId}`),
          isDelete: false,
        },
        { followingId: 1, _id: 0 }
      ).lean();
      const followedUserIds = followedUsers.map((follow) => follow.followingId);

      if (followedUserIds.length === 0) {
        return res.status(200).send({ posts: [] }); // Không có bài viết
      }

      const user = await User.findById(userId, { avatar: 1 });
      const posts = await Post.aggregate([
        {
          $match: {
            userId: { $in: followedUserIds },
            isDeleted: false,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: limitNum,
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
            as: "likeInfo",
          },
        },
        {
          $addFields: {
            likeInfo: {
              $filter: {
                input: "$likeInfo", // Dữ liệu cần lọc
                as: "like", // Biến đại diện cho từng phần tử trong mảng
                cond: { $eq: ["$$like.isDeleted", false] }, // Điều kiện lọc
              },
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "likeInfo.userId",
            foreignField: "_id",
            as: "likedUserInfo",
          },
        },
        {
          $lookup: {
            from: "postusers", // Tên collection của PostUser
            let: { postId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$postId", "$$postId"] },
                      { $eq: ["$userId", new ObjectId(`${userId}`)] },
                      { $eq: ["$isDeleted", false] },
                    ],
                  },
                },
              },
            ],
            as: "savedInfo",
          },
        },
        {
          $lookup: {
            from: "postusers", // Tên collection của PostUser
            let: { postId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$postId", "$$postId"] },
                      { $eq: ["$userId", new ObjectId(`${userId}`)] },
                      { $eq: ["$isDeleted", false] },
                    ],
                  },
                },
              },
            ],
            as: "userAccessSaved",
          },
        },
        {
          $lookup: {
            from: "likes", // Tên collection chứa thông tin 'Like'
            let: { targetId: "$_id" }, // Lấy _id của Post để dùng trong điều kiện nối
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$targetId", "$$targetId"] }, // So sánh targetId trong Like với _id trong Post
                      { $eq: ["$userId", new ObjectId(`${userId}`)] }, // Lọc theo userId
                      { $eq: ["$targetType", "post"] }, // Chỉ lấy dữ liệu 'Like' cho bài viết (post)
                      { $eq: ["$isDeleted", false] }, // Không lấy các like đã bị xóa
                    ],
                  },
                },
              },
            ],
            as: "userAccessLiked", // Tên trường chứa kết quả nối
          },
        },
        {
          $addFields: {
            isSaved: { $gt: [{ $size: "$userAccessSaved" }, 0] }, // Nếu có dữ liệu trong savedInfo, isSaved sẽ là true
            isLiked: { $gt: [{ $size: "$userAccessLiked" }, 0] }, // Nếu có dữ liệu trong savedInfo, isSaved sẽ là true
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
            userInfo: 1,
            //likedUserInfo: { $arrayElemAt: ["$likedUserInfo", 0] },
            "likedUserInfo.lastname": 1,
            "likedUserInfo.firstname": 1,
            "likedUserInfo._id": 1,
            "likedUserInfo.avatar": 1,
            isSaved: 1,
            isLiked: 1,
          },
        },
      ]);
      res.status(200).json({ posts: posts, user: user });
    } catch (e) {
      console.log(e);
    }
  }

  async getPostById(req, res) {
    try {
      const { postId, userAccessId } = req.query;
      console.log("abcdfzzxx", postId, userAccessId);
      if (!ObjectId.isValid(postId) && !ObjectId.isValid(userAccessId)) {
        return res.status(400).json({
          error: "Invalid userAccessId,postId format",
          userAccessId,
          postId,
        });
      }
      connectToDb();
      const posts = await Post.aggregate([
        {
          $match: {
            _id: new ObjectId(`${postId}`),
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
            as: "likeInfo",
          },
        },
        {
          $addFields: {
            likeInfo: {
              $filter: {
                input: "$likeInfo", // Dữ liệu cần lọc
                as: "like", // Biến đại diện cho từng phần tử trong mảng
                cond: { $eq: ["$$like.isDeleted", false] }, // Điều kiện lọc
              },
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "likeInfo.userId",
            foreignField: "_id",
            as: "likedUserInfo",
          },
        },
        {
          $lookup: {
            from: "postusers", // Tên collection của PostUser
            let: { postId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$postId", "$$postId"] },
                      { $eq: ["$userId", new ObjectId(`${userAccessId}`)] },
                      { $eq: ["$isDeleted", false] },
                    ],
                  },
                },
              },
            ],
            as: "savedInfo",
          },
        },
        {
          $lookup: {
            from: "postusers", // Tên collection của PostUser
            let: { postId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$postId", "$$postId"] },
                      { $eq: ["$userId", new ObjectId(`${userAccessId}`)] },
                      { $eq: ["$isDeleted", false] },
                    ],
                  },
                },
              },
            ],
            as: "userAccessSaved",
          },
        },
        {
          $lookup: {
            from: "likes", // Tên collection chứa thông tin 'Like'
            let: { targetId: "$_id" }, // Lấy _id của Post để dùng trong điều kiện nối
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$targetId", "$$targetId"] }, // So sánh targetId trong Like với _id trong Post
                      { $eq: ["$userId", new ObjectId(`${userAccessId}`)] }, // Lọc theo userId
                      { $eq: ["$targetType", "post"] }, // Chỉ lấy dữ liệu 'Like' cho bài viết (post)
                      { $eq: ["$isDeleted", false] }, // Không lấy các like đã bị xóa
                    ],
                  },
                },
              },
            ],
            as: "userAccessLiked", // Tên trường chứa kết quả nối
          },
        },
        {
          $addFields: {
            isSaved: { $gt: [{ $size: "$userAccessSaved" }, 0] }, // Nếu có dữ liệu trong savedInfo, isSaved sẽ là true
            isLiked: { $gt: [{ $size: "$userAccessLiked" }, 0] }, // Nếu có dữ liệu trong savedInfo, isSaved sẽ là true
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
            //likedUserInfo: { $arrayElemAt: ["$likedUserInfo", 0] },
            "likedUserInfo.lastname": 1,
            "likedUserInfo.firstname": 1,
            "likedUserInfo._id": 1,
            "likedUserInfo.avatar": 1,
            "likedUserInfo.email": 1,
            isSaved: 1,
            isLiked: 1,
          },
        },
      ]);
      res.status(200).json({ post: posts[0] });
    } catch (e) {
      console.log(e);
    }
  }

  async deletePostById(req, res) {
    try {
      const { postId } = req.query;
      if (!postId) {
        return res.status(400).json({ error: "postId is required" });
      }
      connectToDb();
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { isDeleted: true, updatedAt: new Date() },
        { new: true }
      );

      if (updatedPost) {
        res.status(200).send({
          message: "Post deleted successfully",
          deletedPost: updatedPost,
        });
      } else {
        res.status(400).send({ message: "Post not found" });
      }
    } catch (e) {
      res.status(500).send({ message: "Server error" });
    }
  }

  async getFavouritedPostsByUserId(req, res) {
    try {
      const { userId } = req.query;
      if (!ObjectId.isValid(userId)) {
        return res.status(400).send({ error: "Invalid userId format", userId });
      }
      connectToDb();

      const post = await Post.aggregate([
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
            as: "likeInfo",
          },
        },
        {
          $addFields: {
            likeInfo: {
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
                      $eq: ["$$like.userId", new ObjectId(`${userId}`)],
                      $eq: ["$$like.isDeleted", false],
                    }, // Điều kiện lọc
                  },
                },
                0,
              ],
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "likeInfo.userId",
            foreignField: "_id",
            as: "likedUserInfo",
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
            userInfo: 1,
            "likedUserInfo.lastname": 1,
            "likedUserInfo.firstname": 1,
            "likedUserInfo._id": 1,
            "likedUserInfo.avatar": 1,
            isLiked: 1,
          },
        },
        {
          $limit: 1,
        },
      ]);
      res.status(200).json({ post: post });
    } catch (e) {
      console.log(e);
    }
  }

  async updateTitleAndContentAndImagesPostByPostId(req, res) {
    try {
      const { postId, title, content, images } = req.body;
      if (!ObjectId.isValid(postId)) {
        return res.status(400).send({ error: "Invalid postId format", postId });
      }
      if (!postId || !title || !content) {
        return res
          .status(400)
          .json({ message: "Not enough required information!" });
      }
      connectToDb();

      const post = await Post.findById(postId);
      if (post) {
        post.title = title;
        post.content = content;
        post.images = images;
        post.save();
        return res.status(200).json({ message: "Update post successfully" });
      } else {
        return res.status(404).json({ message: "Post is not found" });
      }
    } catch (e) {
      return res.status(500).send({ message: "Server error" });
    }
  }
}

module.exports = new PostController();
