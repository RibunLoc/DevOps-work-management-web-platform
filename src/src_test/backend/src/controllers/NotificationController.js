const mongoose = require("mongoose");
const connectToDb = require("../config/database/db");
const Event = require("../models/Event");
const Notification = require("../models/Notification")
mongoose.set("debug", true);

class EventController {
    //[POST]
    async create(req, res) {
        console.log("Create example");
        try {
            connectToDb();
            const notiArray
            =
                req.body;
            for (let noti of notiArray) {
                const { eventType, postId, userName,userAvatar, postOwnerEmail} = noti;

                const newNotification = Notification({
                    postOwnerEmail:postOwnerEmail,
                    eventType: eventType,
                    postId: postId,
                    userName: userName,
                    userAvatar: userAvatar,
                    createdAt: new Date,
                    isDelete: false
                });

                await newNotification.save();
            }


            //console.log(newUser)

            

            return res.status(200).json({
                message: "create new notification successfully",
            });
        } catch (e) {
            console.log("Some error in notification. Try again!!", e);
        }
    }

    async getRecentNoti(req, res) {
        try {
            // Đảm bảo kết nối được thiết lập
            await connectToDb();

            const { page, limit, postOwnerEmail } = req.query

            // Lấy tất cả sự kiện chưa bị xóa và sắp xếp theo thời gian cập nhật mới nhất
            const noties = await Notification.find({ postOwnerEmail: postOwnerEmail })
            .sort({ createdAt: -1 })
                .skip((page - 1) * limit) // Skip the documents for previous pages
                .limit(limit); // Limit the number of documents returned

                console.log("noties array", noties)
            if (noties.length > 0) {
                const totalNoties = await Notification.countDocuments({ isDeleted: false, postOwnerEmail: postOwnerEmail }); // Total count of recipes
                const totalPages = Math.ceil(totalNoties / limit); // Calculate total pages

                return res.status(200).json({
                    "noties":noties,
                    pagination: {
                        totalNoties,
                        totalPages,
                        currentPage: page,
                        pageSize: noties.length,
                    },
                });
            } else {
                return res.status(404).send('No recipe found');
            }
        } catch (e) {
            // Quản lý lỗi
            console.error(e);
            res.status(500).json({
                error: "An error occurred while getting notification",
            });
        }
    }

}

module.exports = new EventController();
