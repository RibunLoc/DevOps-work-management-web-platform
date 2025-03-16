const Follow = require("../models/Follow");
const Post = require("../models/Post");
const User = require("../models/User");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const connectToDb = require("../config/database/db");
mongoose.set("debug", true);

class FollowController {
  //[POST]
  async createFollow(req, res) {
    try {
      const { followerId, followingId } = req.body;
      if (!followerId || !followingId) {
        return res
          .status(400)
          .json({ message: "Missing followerId or followingId" });
      }
      if (!ObjectId.isValid(followerId) || !ObjectId.isValid(followingId)) {
        return res.status(400).send({
          error: "Invalid followerId,followingId format",
          followerId,
          followingId,
        });
      }
      // Kiểm tra xem đã có bản ghi trong bảng follows hay chưa
      let followRecord = await Follow.findOne({ followerId, followingId });

      if (followRecord) {
        // Nếu bản ghi đã tồn tại, nhưng bị hủy theo dõi trước đó, cập nhật lại isDelete
        if (followRecord.isDelete) {
          followRecord.isDelete = false;
          followRecord.dateTime = new Date();
          await followRecord.save();
        }
      } else {
        // Nếu bản ghi chưa tồn tại, tạo một bản ghi mới
        followRecord = new Follow({
          followerId: followerId,
          followingId: followingId,
          dateTime: new Date(),
          isDelete: false,
        });
        await followRecord.save();
      }

      return res.status(200).json({
        message: "Followed successfully",
      });
    } catch (e) {
      console.log("Error following user", e);
      res.status(500).json({ message: "Error following user" });
    }
  }

  async isFollowed(req, res) {
    try {
      const { followerId, followingId } = req.body;

      // Kiểm tra input
      if (!followerId || !followingId) {
        return res
          .status(400)
          .json({ message: "Missing followerId or followingId" });
      }

      // Kiểm tra định dạng ObjectId
      if (!ObjectId.isValid(followerId) || !ObjectId.isValid(followingId)) {
        return res.status(400).json({
          error: "Invalid followerId or followingId format",
          followerId,
          followingId,
        });
      }

      // Tìm kiếm trong cơ sở dữ liệu
      const existingFollow = await Follow.findOne({
        followerId: new ObjectId(`${followerId}`),
        followingId: new ObjectId(`${followingId}`),
      });

      // Trả về kết quả
      if (existingFollow) {
        return res.status(200).json({ isFollowed: true });
      } else {
        return res.status(200).json({ isFollowed: false });
      }
    } catch (e) {
      console.log("Error finding following user", e);
      res.status(500).json({ message: "Error finding following user" });
    }
  }

  async createIgnore(req, res) {
    console.log("Create example");
    try {
      const { ignorerId, ignoringId } = req.body;
      if (!ignorerId || !ignoringId) {
        return res
          .status(400)
          .json({ message: "Missing followerId or followingId" });
      }
      if (!ObjectId.isValid(ignorerId) || !ObjectId.isValid(ignoringId)) {
        return res.status(400).send({
          error: "Invalid ignorerId,ignoringId format",
          ignorerId,
          ignoringId,
        });
      }
      // Kiểm tra xem đã có bản ghi trong bảng follows hay chưa
      let followRecord = await Follow.findOne({
        followerId: ignorerId,
        followingId: ignoringId,
      });

      if (followRecord) {
        // Nếu bản ghi đã tồn tại, nhưng bị hủy theo dõi trước đó, cập nhật lại isDelete
        if (!followRecord.isIgnore) {
          followRecord.isIgnore = true;
          await followRecord.save();
        }
      } else {
        // Nếu bản ghi chưa tồn tại, tạo một bản ghi mới
        followRecord = new Follow({
          followerId: ignorerId,
          followingId: ignoringId,
          dateTime: new Date(),
          isDelete: true,
          isIgnore: true,
        });
        await followRecord.save();
      }

      return res.status(200).json({
        message: "Ignore successfully",
      });
    } catch (e) {
      console.log("Error ignore user", e);
      res.status(500).json({ message: "Error ignore user" });
    }
  }

  async getNotFollows(req, res) {
    try {
      connectToDb();
      const { followerId } = req.params;
      if (!ObjectId.isValid(followerId)) {
        return res.status(400).send({
          error: "Invalid followerId format",
        });
      }
      // Bước 1: Lấy danh sách những người mà người dùng đã follow (isDelete = false)
      const following = await Follow.find({
        followerId: followerId,
        isDelete: false,
      }).populate("followingId");
      const ignoring = await Follow.find({
        followerId: followerId,
        isDelete: true,
        isIgnore: true,
      }).populate("followingId");
      // Lấy danh sách UserID của những người đã follow
      const followingId = following.map((follow) => follow.followingId);
      //Laysay danh sách UserID của ngững người đã ignore
      const ignoringId = ignoring.map((ignore) => ignore.followingId);
      // Bước 2: Lấy danh sách những người chưa follow (exclude người dùng hiện tại và những người đã follow)
      const notFollowed = await User.find({
        _id: { $nin: [followerId, ...followingId, ...ignoringId] },
      });

      res.json({
        notFollowed: notFollowed,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async getFollowingByUserId(req, res) {
    try {
      connectToDb();
      const { followerId, searchString } = req.query;
      //console.log("abcdefghjlklkaslkasd", followerId);
      if (!ObjectId.isValid(followerId)) {
        return res.status(400).send({
          error: "Invalid followerId format",
        });
      }
      // Bước 1: Lấy danh sách những người mà người dùng đã follow (isDelete = false)
      const following = await Follow.find({
        followerId: followerId,
        isDelete: false,
      })
        .populate("followingId")
        .sort({ createdAt: -1 });

      if (!following.length) {
        return res.json({
          followingUsers: [],
          message: "No following users found",
        });
      }

      const followingId = following.map((follow) => follow.followingId);

      let query = { _id: { $in: followingId } };

      if (searchString && searchString.trim() !== "") {
        query.$expr = {
          $regexMatch: {
            input: { $concat: ["$firstname", " ", "$lastname"] },
            regex: searchString,
            options: "i",
          },
        };
      }

      const followingUsers = await User.find(query);

      res.json({
        followingUsers: followingUsers,
        searchString: searchString,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async getFollowerByUserId(req, res) {
    try {
      connectToDb();
      const { followingId, searchString } = req.query;
      //console.log("abcdefghjlklkaslkasd", followerId);
      if (!ObjectId.isValid(followingId)) {
        return res.status(400).send({
          error: "Invalid followerId format",
        });
      }
      // Bước 1: Lấy danh sách những người mà người dùng đã follow (isDelete = false)
      const following = await Follow.find({
        followingId: followingId,
        isDelete: false,
      })
        .populate("followingId")
        .sort({ createdAt: -1 });

      if (!following.length) {
        return res.json({
          followingUsers: [],
          message: "No following users found",
        });
      }

      const followerId = following.map((follow) => follow.followerId);

      let query = { _id: { $in: followerId } };

      if (searchString && searchString.trim() !== "") {
        query.$expr = {
          $regexMatch: {
            input: { $concat: ["$firstname", " ", "$lastname"] },
            regex: searchString,
            options: "i",
          },
        };
      }

      const followerUsers = await User.find(query);

      res.json({
        followerUsers: followerUsers,
        searchString: searchString,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async deleteFollow(req, res) {
    try {
      connectToDb();
      const { followerId, followingId } = req.query;
      //console.log("abcdefghjlklkaslkasd",followerId)
      if (!ObjectId.isValid(followerId) || !ObjectId.isValid(followerId)) {
        return res.status(400).send({
          error: "Invalid followerId format",
        });
      }
      const followInfo = await Follow.findOne({
        followerId: followerId,
        followingId: followingId,
      });

      if (followInfo) {
        followInfo.isDelete = true;
        followInfo.save();
        return res.status(200).send({
          unfollowInfo: followInfo,
        });
      } else {
        return res.status(404).send({
          message: "Not found follow information",
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new FollowController();
