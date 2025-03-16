const mongoose = require("mongoose");
const connectToDb = require("../config/database/db");
const Event = require("../models/Event");
mongoose.set("debug", true);

class EventController {
  //[POST]
  async create(req, res) {
    console.log("Create example");
    try {
      connectToDb();
      console.log(req.body);
      const { eventName,
        description,
        dateTime,
        imageUrl,
        location,
        createdBy,
         } =
        req.body;

      const newEvent = Event({
        eventName:eventName,
        description:description,
        dateTime:dateTime,
        imageUrl:imageUrl,
        location:location,
        createdBy:createdBy,
        createdAt:new Date,
        isDelete: false
      });

      //console.log(newUser)

      await newEvent.save();

      return res.status(200).json({
        message: "create new event successfully",
      });
    } catch (e) {
      console.log("Some error in registration. Try again!!", e);
    }
  }

  async getAllEvent(req, res) {
    try {
      // Đảm bảo kết nối được thiết lập
      await connectToDb();
  
      // Lấy tất cả sự kiện chưa bị xóa và sắp xếp theo thời gian cập nhật mới nhất
      const upcomingEventArray = await Event.aggregate([
        {
          $match: {
            isDelete: false, // Kiểm tra trường isDelete thay vì isDeleted
          },
        },
        {
          $sort: {
            dateTime: -1, // Đảm bảo sử dụng tên trường chính xác 'updatedAt'
          },
        },
      ]);
  
      // Kiểm tra và xử lý mảng sự kiện
      const upcoming = upcomingEventArray.length > 0 ? upcomingEventArray : [];
  
      // Trả về kết quả sự kiện
      res.json({
        upcomingEvent: upcoming,
      });
    } catch (e) {
      // Quản lý lỗi
      console.error(e);
      res.status(500).json({
        error: "An error occurred while fetching events",
      });
    }
  }

}

module.exports = new EventController();
