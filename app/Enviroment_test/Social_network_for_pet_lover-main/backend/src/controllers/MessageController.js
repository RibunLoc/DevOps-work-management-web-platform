
const User = require('../models/User')
const Conversation = require('../models/Conversation')
const Message = require('../models/Message')
const mongoose = require('mongoose')
const connectToDb = require('../../src/config/database/db')
mongoose.set('debug', true)

class MessageController {

    //[POST]
    async create(req, res) {
        console.log('abc')


        try {
            connectToDb()
            console.log(req.body)
            const { email, password, firstName, lastName, phone } = req.body

            const newUser = User({
                email: email,
                password: password,
                firstname: firstName,
                lastname: lastName,
                phone: phone,
                createdAt: new Date()
            })

            //console.log(newUser)

            await newUser.save()

            return res.status(200).json({
                message: 'create user successfully'
            })
        } catch (e) {
            console.log('Some error in registration. Try again!!', e)
        }
    }

    async getRencentSender(req, res) {
        try {
            connectToDb()

            const { email } = req.query

            // console.log(typeof email)
            // const message = new Message({
            //     recipentEmail: "Baonguyen1@gmail.com",
            //     senderEmail: "Baonguyen2@gmail.com",

            //     content: "MU Vodoiiiiiii",
            //     sendAt:Date(),
            //     isDeleted: false
            // })

            // console.log(message)

            // await message.save()

            const recentMessagesArray = await Message.aggregate([


                //get all recieved messages

                {
                    '$match': {
                        'recipentEmail': email,
                        'isDeleted': false
                    }
                },

                //sort by latest sent message

                {
                    '$sort': {
                        'sendAt': -1
                    }
                },

                //group by email. content and sendAt

                {
                    '$group': {
                        '_id': '$senderEmail',
                        'latestMessage': { '$first': "$content" },
                        'timeStamp': { '$first': "$sendAt" }
                    }

                },
                {
                    $lookup: {
                        from: "users",
                        localField: "_id", // Trường `_id` hiện đang là `senderEmail`
                        foreignField: "email", // Trường email trong Users
                        as: "userInfo"
                    }
                },
                {
                    $unwind: "$userInfo" // Giải nén để lấy thông tin người dùng từ `userInfo`
                },
                {
                    $project: {
                        _id: 1,
                        latestMessage: 1,
                        timeStamp: 1,
                        "userInfo.firstname": 1, // Lấy thông tin cần thiết từ `userInfo`
                        "userInfo.lastname": 1,
                        "userInfo.avatar": 1,
                        "userInfo.location": 1
                    }
                }
                ,
                {
                    '$lookup': {
                        'from': 'users',
                        'localField': '_id',
                        'foreignField': 'email',
                        'as': 'userInfo'
                    }
                },
                // Optionally, unwind userInfo if you want it as a single object
                {
                    '$unwind': {
                        'path': '$userInfo',
                        'preserveNullAndEmptyArrays': true  // In case there's no matching user

                    }
                }

            ])

            const recentMessages = recentMessagesArray.length > 0 ? recentMessagesArray : []


            console.log("recentMessages", recentMessages)


            res.json({
                'recentMessages': recentMessages
            })
        } catch (e) {
            console.log(e)
        }
    }

    async getChatHistory(req, res) {
        try {
            connectToDb()

            const { senderEmail, recipentEmail } = req.query

            console.log(typeof email)
            console.log("recipentEmail", recipentEmail)
            console.log("type", typeof recipentEmail)


            res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.set('Pragma', 'no-cache');
            res.set('Expires', '0');
            res.set('Surrogate-Control', 'no-store');
            const chatHistoryArray = await Message.aggregate([
                {
                    '$match': {
                      '$expr': {
                        '$or': [
                          {
                            '$and': [
                              {
                                '$eq': [
                                  '$recipentEmail', senderEmail
                                ]
                              }, {
                                '$eq': [
                                  '$senderEmail', recipentEmail
                                ]
                              }, {
                                '$eq': [
                                  '$isDeleted', false
                                ]
                              }
                            ]
                          }, {
                            '$and': [
                              {
                                '$eq': [
                                  '$recipentEmail', recipentEmail
                                ]
                              }, {
                                '$eq': [
                                  '$senderEmail', senderEmail
                                ]
                              }, {
                                '$eq': [
                                  '$isDeleted', false
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    }
                  },
                {
                    '$addFields': {

                        'isSender': { '$eq': ['$senderEmail', senderEmail] },
                        'timeStamp': '$sendAt'
                    }
                },
                //sort by latest sent message
                {
                    '$sort': {

                        'sendAt': -1
                    }
                },
                {
                    '$limit': 10
                }
            ])

            const chatHistory = chatHistoryArray.length > 0 ? chatHistoryArray : []

            console.log("chatHistory", chatHistory)

            res.json({
                'chatHistory': chatHistory
            })
        } catch (e) {
            console.log(e)
        }
    }

    async saveMessage(req, res) {
        try {

            connectToDb()
            const { senderEmail, recipentEmail, content, image } = req.query

            const newMessage = new Message({
                senderEmail: senderEmail,
                recipentEmail: recipentEmail,
                content: content,
                sendAt: new Date(),
                isDeleted: false,
                image: image
            })

            

            await newMessage.save()

            return res.status(200)
        } catch (e) {
            console.log("Some erros happen", e)
        }
    }

    async getConversation(req, res) {
        try {

            connectToDb()
            const { senderEmail, recipentEmail } = req.query

            const conversation = await Conversation.findOne({
                'participant': { '$all': [senderEmail, recipentEmail] },
            });
            if (!conversation) {
                return res.status(404).json({
                    message: "no conversation found"
                })
            }


            return res.status(200).json({
                "image": conversation.image,
                "theme": conversation.theme
            })
        } catch (e) {
            console.log("Some erros happen", e)
        }
    }


    async postConversation(req, res) {
        try {

            connectToDb()
            const { senderEmail, recipentEmail, image, theme } = req.body

            const conversation = await Conversation.findOne({
                'participant': { '$all': [senderEmail, recipentEmail] },
            });
            if (conversation) {
                conversation.image = image
                conversation.theme = theme

                await conversation.save()
            } else {
                const newConversation = new Conversation({
                    participant: [senderEmail, recipentEmail],
                    image: image,
                    theme: theme
                })

                await newConversation.save()
            }


            return res.status(200).json({
                message: "update background image successfully"
            })
        } catch (e) {
            console.log("Some erros happen", e)
        }
    }

    // async getRencentMessage(req,res) {
    //     try {
    //         connectToDb()


    //     } catch(e) {
    //         console.log("Some errors happen", e)
    //     }
    // }
}


module.exports = new MessageController

//param
//query param
//body

