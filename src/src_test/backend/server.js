const express = require("express");
const morgan = require("morgan");
const api = require("./src/apis/index");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(morgan("combined"));

// API routes
api(app);

// Create a unified HTTP server
const server = http.createServer(app);

// Integrate Socket.IO with the same server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"], // Allowed methods
    allowedHeaders: ["Content-Type"], // Allowed headers
  },
});

// Socket.IO logic
const userRegistration = {};

io.on("connection", (socket) => {
  console.log(`User connected with id ${socket.id}`);

  socket.on("chatMessage", (sendMessage) => {
    console.log("sendMessage", sendMessage);
    const recipientId = userRegistration[sendMessage.recipientEmail];
    console.log("recipientId", recipientId);
    socket.to(recipientId).emit("newMessage", {
      sendFrom: sendMessage.senderEmail,
      content: sendMessage.content,
      image: sendMessage.image,
    });
  });

  socket.on("register", (email) => {
    console.log(email);
    userRegistration[email] = socket.id;
    console.log(userRegistration);
  });

  socket.on("changeBackground", (image) => {
    console.log(image);
    const recipientId = userRegistration[image.recipientEmail];
    socket.to(recipientId).emit("changeBackground", {
      sendFrom: image.senderEmail,
      src: image.src,
      theme: image.theme,
    });
  });

  socket.on("newLike", (like) => {
    console.log("new Like", like);
    const recipientId = userRegistration[like.postOwnerEmail];
    console.log("userRegistration", userRegistration);
    console.log("like.postOwnerEmail", like.postOwnerEmail);
    console.log("new like recipient id", recipientId);
    socket.to(recipientId).emit("newLikeOnPost", {
      user: like.userEmail,
      postId: like.postId,
      type: like.type,
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the unified server
server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
