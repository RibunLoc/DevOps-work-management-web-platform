const mongoose = require("mongoose");
const connectToDb = require("../config/database/db");
const History = require("../models/History");
const { ObjectId } = require("mongodb");
const User = require("../models/User");

mongoose.set("debug", true);

class HistoryController {
  //[POST]
  async create(req, res) {
    try {
      connectToDb();
      const { userId, targetId, type } = req.body;
      if (!userId || !targetId || !type) {
        return res.status(400).json({
          message:
            "Missing required fields: userId, targetId, type are required.",
          userId,
          targetId,
          type,
        });
      }
      if (!ObjectId.isValid(userId)) {
        return res.status(400).send({ error: "Invalid userId format", userId });
      }
      if (type === "search") {
        const existingHistory = await History.findOne({
          userId: new ObjectId(`${userId}`),
          type: "search",
          targetId: new ObjectId(`${targetId}`),
        });

        if (!existingHistory) {
          const newHistory = History({
            userId: userId,
            targetId: targetId,
            type: "search",
          });
          await newHistory.save();
      console.log("createhisstory",userId, targetId, type )

          return res.status(200).json({ searchHistory: newHistory });
        } else {
          existingHistory.updatedAt = new Date;
          existingHistory.isDeleted = false;
          await existingHistory.save();
          return res.status(200).json({ searchHistory: existingHistory });
        }
      }
    } catch (e) {
      console.error("Error while creating a history:", e);
      return res.status(500).json({
        message:
          "An error occurred while creating the history. Please try again later.",
      });
    }
  }

  async getSearchHistory(req, res) {
    try {
      connectToDb();
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({
          message: "Missing required fields: userId are required.",
          userId,
        });
      }
      if (!ObjectId.isValid(userId)) {
        return res.status(400).send({ error: "Invalid userId format", userId });
      }
      const existingHistories = await History.find({
        userId: new ObjectId(`${userId}`),
        type: "search",
        isDeleted:false
      });
      const userIds = existingHistories.map(history => history.targetId);
      if (userIds && userIds.length > 0) {
        const usersSearched = await User.find({
          _id: { $in: userIds },
        },'_id email phone firstname lastname createdAt avatar location description');
        return res.status(200).json({
          searchHistoryUsers: usersSearched,
        });
      } else
        return res.status(404).json({
          message: "History is not found",
          searchHistoryUsers: [],
        });
    } catch (e) {
      console.error("Error while find a history:", e);
      return res.status(500).json({
        message:
          "An error occurred while find history. Please try again later.",
      });
    }
  }

  async deleteHistory(req, res) {
    try {
      connectToDb();
      const { userId, targetId, type } = req.body;
      console.log("deleteHistory",userId, targetId, type)
      if (!userId || !targetId || !type) {
        return res.status(400).json({
          message:
            "Missing required fields: userId, targetId, type are required.",
          userId,
          targetId,
          type,
        });
      }
      if (!ObjectId.isValid(userId)) {
        return res.status(400).send({ error: "Invalid userId format", userId });
      }
      const existingHistory = await History.findOne({userId:new ObjectId(`${userId}`),targetId:new ObjectId(`${targetId}`),type:type});
      if (existingHistory) {
        existingHistory.isDeleted = true;
        await existingHistory.save();
        return res.status(200).json({
          message: "delete history successfully",
          deleteHistory: existingHistory,
        });
      } else
        return res.status(404).json({
          message: "History is not found",
          deleteHistory : {}
        });
    } catch (e) {
      console.error("Error while creating a comment:", e);
      return res.status(500).json({
        message:
          "An error occurred while delete history. Please try again later.",
      });
    }
  }
}

module.exports = new HistoryController();
