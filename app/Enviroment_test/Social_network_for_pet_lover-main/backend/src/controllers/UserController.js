//const User = require("../models/user")

const Pet = require("../models/Pet");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); //
const connectToDb = require("../config/database/db");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
mongoose.set("debug", true);

class UserController {
  //[GET] user info
  async getAll(req, res) {
    await connectToDb();
    const userInfo = await User.find(

      {},
      { avatar: 1, location: 1, firstname: 1, lastname: 1 }
    );

    const formattedUserInfo = userInfo.map((user) => {
      const { firstname, lastname, ...rest } = user.toObject(); // Destructure to exclude firstname and lastname
      return {
        ...rest, // Spread the remaining fields
        fullName: `${firstname} ${lastname}`, // Combine names into fullName
      };
    });

    try {
      if (formattedUserInfo) {
        return res.json(formattedUserInfo);
      }
    } catch (e) {
      console.log("Some errors happen", e);
    }
  }
  async getInfo(req, res) {
    await connectToDb();
    const { email } = req.query;

    const userInfo = await User.findOne({ email });

    try {
      if (userInfo) {
        res.json({
          userInfo: userInfo,
        });
      }
    } catch (e) {
      console.log("Some errors happen", e);
    }
  }

  async setAvatar(req, res) {
    await connectToDb();
    const { email, avtar } = req.query;

    const user = await User.find({ email });

    try {
      if (user) {
        user.avtar = avtar;
        await user.save();
        res.status(200).json(user);
      } else {
        res.status(404).send("email not found");
      }
    } catch (e) {
      console.log("Some errors happen", e);
    }
  }

  async getUserById(req, res) {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      if (!ObjectId.isValid(userId)) {
        return res.status(400).send({ error: "Invalid userId format", userId });
      }
      await connectToDb();
      const user = await User.findOne(
        { _id: new ObjectId(`${userId}`) },
        {
          avatar: 1,
          description: 1,
          firstname: 1,
          lastname: 1,
          location: 1,
          email: 1,
        }
      );
      if (user) {
        const petCount = await Pet.countDocuments({
          userId: new ObjectId(`${userId}`),
          isDeleted: false,
        });
        const result = {
          ...user.toObject(),
          petCount: petCount,
        };
        return res.json({ user: result });
      } else {
        return res.status(404).json({ error: "User not found" });
      }
    } catch (e) {
      console.log(e);
    }
  }

  async verify(req, res) {
    try {
      let token = req.headers["authorization"];
      if (!token) {
        console.log(token);
        return res.status(401).json({
          status: "error",
          code: 401,
          message: "Authorization header is required",
          data: null,
          errors: "Unauthorized",
        });
      } else {
        token = token.split(" ")[1];
      }

      jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
          return res.status(401).json({
            status: "error",
            code: 401,
            message: "Invalid token. You need to login first",
            data: null,
            errors: "Unauthorized",
          });
        }

        return res.status(200).json({
          status: "success",
          code: 200,
        });
      });
    } catch (e) {
      return res.status(500).json({
        status: "error",
        code: 500,
        message: "Internal server error",
      });
    }
  }

  // async getAvatar(req,res) {
  //     await connectToDb()
  //     const { email, avtar } = req.query

  //     const user = await User.find({ email })

  //     try {
  //         if (user) {
  //             user.avtar = avtar
  //             await user.save()
  //             res.status(200).json(user)
  //         } else {
  //             res.status(404).send('email not found')
  //         }
  //     } catch (e) {
  //         console.log('Some errors happen', e)
  //     }
  // }

  // async delete(req,res) {
  //     res.status(204).send();
  // }
  async updateNameByUserId(req, res) {
    try {
      const { userId, lastName, firstName } = req.body;
      console.log("abcdefgh", userId, lastName, firstName);
      if (!userId) {
        return res
          .status(400)
          .json({ message: "Not enougddddh required information!" });
      }
      if (!userId || !lastName || !firstName) {
        return res
          .status(400)
          .json({ message: "Not enough required information!" });
      }
      if (!ObjectId.isValid(userId)) {
        return res.status(400).send({ error: "Invalid userId format", userId });
      }
      connectToDb();

      const user = await User.findById(userId);
      if (user) {
        user.firstname = firstName;
        user.lastName = lastName;
        user.save();
        return res
          .status(200)
          .json({ message: "Updated user successfully!", updatedUser: user });
      } else return res.status(404).json({ message: "Not Found User!" });
    } catch (e) {
      return res.status(400).send({ error: "Some error, can't update name" });
    }
  }

  async updateDescriptionByUserId(req, res) {
    try {
      const { userId, description } = req.body;
      //console.log("abcdefgh",userId,description)
      if (!userId || !description) {
        return res
          .status(400)
          .json({ message: "Not enough required information!" });
      }
      if (!ObjectId.isValid(userId)) {
        return res.status(400).send({ error: "Invalid userId format", userId });
      }
      connectToDb();

      const user = await User.findById(userId);
      if (user) {
        user.description = description;
        user.save();
        return res
          .status(200)
          .json({ message: "Updated user successfully!", updatedUser: user });
      } else return res.status(404).json({ message: "Not Found User!" });
    } catch (e) {
      return res.status(400).send({ error: "Some error, can't update name" });
    }
  }

  async updateAvatarByUserId(req, res) {
    try {
      const { userId, imageUrl } = req.body;
      //console.log("abcdefgh",userId,imageUrl )
      if (!userId || !imageUrl) {
        return res
          .status(400)
          .json({ message: "Not enough required information!" });
      }
      if (!ObjectId.isValid(userId)) {
        return res.status(400).send({ error: "Invalid userId format", userId });
      }
      connectToDb();

      const user = await User.findById(userId);
      if (user) {
        user.avatar = imageUrl;
        user.save();
        return res
          .status(200)
          .json({ message: "Updated user successfully!", updatedUser: user });
      } else return res.status(404).json({ message: "Not Found User!" });
    } catch (e) {
      return res.status(400).send({ error: "Some error, can't update name" });
    }
  }
  async getUserByUserName(req, res) {
    try {
      connectToDb();
      const { searchString } = req.query;
      if (!searchString && searchString.trim() === "") {
        return res.json({
          usersResult: [],
          message: "searchString is empty",
        });
      }
      const usersResult = await User.find({
        $expr: {
          $regexMatch: {
            input: { $concat: ["$firstname", " ", "$lastname"] },
            regex: searchString,
            options: "i",
          },
        },
      });

      if (usersResult)
        res.json({
          usersResult: usersResult,
          searchString: searchString,
        });
      else {
        res.json({
          usersResult: [],
          searchString: searchString,
          message: "User name is not found",
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  async sendResetLink(req, res) {
    try {
      connectToDb();

      const { user_email } = req.query;
      const user = await User.findOne({ email: user_email });

      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      const resetToken = crypto.randomBytes(32).toString("hex");

      user.resetPasswordToken = resetToken;

      await user.save();

      const resetUrl = `http://127.0.0.1:5000/api/v1/user/reset_password/${resetToken}`;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user_email,
        subject: "Password Reset Request",
        html: `<p>Hi ${user.email},</p>
                   <p>We received a request to reset your password. Click the link below to set a new password:</p>
                   <a href="${resetUrl}">Reset your password</a>
                   <p>If you did not request this, you can ignore this email.</p>`,
      };

      transporter.sendMail(mailOptions);

      res.status(200).json({
        message: "send mail successfully",
      });
    } catch (e) {
      res.status(400).send("Fail to send reset link");
      console.log("Error", e);
    }
  }

  async resetPassword(req, res) {
    try {
      connectToDb();

      const { newPassword, token  } = req.body;

      const user = await User.findOne({ resetPasswordToken: token });

      if (!user) {
        res.status(400).send("Invalid token");
      }


      user.password = newPassword;
      user.resetPasswordToken = undefined;

      await user.save();

      res.status(200).send("Reset password successfully");
    } catch (e) {
      console.error("Error resetting password:", e);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async resetPasswordForm(req, res) {
    try {
      connectToDb();

      const { token } = req.params;

      res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Reset Password</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            background-color: #f4f4f9;
                        }
                        .form-container {
                            background: #fff;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                            width: 300px;
                            text-align: center;
                        }
                        input {
                            width: calc(100% - 20px);
                            padding: 10px;
                            margin: 10px 0;
                            border: 1px solid #ccc;
                            border-radius: 4px;
                        }
                        button {
                            width: 100%;
                            padding: 10px;
                            background: #007bff;
                            color: #fff;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                        }
                        button:hover {
                            background: #0056b3;
                        }
                        .error-message, .success-message {
                            color: red;
                            margin-top: 10px;
                            display: none;
                        }
                        .success-message {
                            color: green;
                        }
                    </style>
                </head>
                <body>
                    <div class="form-container">
                        <h2>Reset Password</h2>
                        <form id="resetPasswordForm">
                            <input type="password" id="newPassword" name="newPassword" placeholder="Enter new password" required />
                            <input type="hidden" id="resetToken" name="token" value="${token}" />
                            <button type="submit">Reset Password</button>
                        </form>
                        <p id="responseMessage" class="error-message"></p>
                        <p id="successMessage" class="success-message"></p>
                    </div>
                    <script>
                        document.getElementById('resetPasswordForm').addEventListener('submit', async function (event) {
                            event.preventDefault();
    
                            const newPassword = document.getElementById('newPassword').value;
                            const token = document.getElementById('resetToken').value;
                            const responseMessage = document.getElementById('responseMessage');
                            const successMessage = document.getElementById('successMessage');
    
                            try {
                                const response = await fetch('http://127.0.0.1:5000/api/v1/user/reset_password/post', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ token, newPassword })
                                });
    
                                if (response.ok) {
                                    responseMessage.style.display = 'none';
                                    successMessage.textContent = "Password reset successfully!";
                                    successMessage.style.display = 'block';
                                } else {
                                    const errorData = await response.json();
                                    responseMessage.textContent = errorData.message || 'Failed to reset password.';
                                    responseMessage.style.display = 'block';
                                    successMessage.style.display = 'none';
                                }
                            } catch (error) {
                                responseMessage.textContent = 'Something went wrong. Please try again later.';
                                responseMessage.style.display = 'block';
                                successMessage.style.display = 'none';
                            }
                        });
                    </script>
                </body>
                </html>
            `);
    } catch (e) {
      console.error("Error resetting password:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async changePassword(req, res) {
    // debugger;
    connectToDb()
    const { user_id } = req.params;
    const { oldPassword, newPassword } = req.body;
    console.log("oldPassword", oldPassword);
    console.log("newPassword", newPassword);
    const setNewPassword = async (user) => {
      user.password = newPassword;
      await user.save();
    };
    try {
      const user = await User.findOne({ _id: user_id });
      if (!user) {
        return res.status(204).json({ message: "User not found" });
      }

      // Compare old password
      const isMatched = await bcrypt.compare(oldPassword, user.password); // Use the Promise version
      if (!isMatched) {
        return res.status(201).json({ message: "Wrong old password" });
      }

      // Update to new password
      await setNewPassword(user);

      // Send success response
      return res.status(200).json({
        status: "success",
        code: 200,
        message: "Password changed successfully",
        errors: null,
      });
    } catch (e) {
      console.log("Error", e);
      return res.status(500).send("Internal server error");
    }
  }

  async deleteUser(req,res) {
    connectToDb()
    try {
      const deleted = await User.deleteMany({firstname: "John"})
      console.log(deleted)
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new UserController();
