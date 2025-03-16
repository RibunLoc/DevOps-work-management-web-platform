
const User = require('../models/User')
const Image = require('../models/Image')
const Message = require('../models/Message')
const mongoose = require('mongoose')
const connectToDb = require('../../src/config/database/db')
mongoose.set('debug', true)

class ImageController {

    async uploadFile (req,res) {
        try {
            connectToDb()
            const {type} = req.query
            const {senderEmail, recipentEmail, link, name} = req.body
            console.log("body", req.body)
            console.log("senderEmail", senderEmail)
            console.log("link", link)
            if(type === "messageImage" || type === "messageBackground") {
                const image = new Image({
                    senderEmail: senderEmail,
                    recipentEmail: recipentEmail,
                    link: link,
                    name: name,
                    sendAt: Date()
                })

                await image.save()
            }

            return res.status(200).json({
                message: "upload image successfully"
            })
        } catch (e) {
            console.log(e)
            return res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    async retriveFile (req,res) {
        try {
            const {type, senderEmail, recipentEmail} = req.query
            var backgroundImageArray = []
            if (type === "messageBackground") {
                backgroundImageArray = await Image.find({
                    senderEmail: senderEmail,
                    recipentEmail: recipentEmail,
                    isDeleted: false
                })
    
            }
            
            const backgroundImages = backgroundImageArray.length>0? backgroundImageArray:[]
            
            console.log("backgroundImages",backgroundImages)

            return res.status(200).json({
                "backgroundImages": backgroundImages
            })
        } catch (e) {
            console.log(e)
            return res.status(500).json({
                message: "Internal server error"
            })
        }
    }
}


module.exports = new ImageController

//param
//query param
//body

