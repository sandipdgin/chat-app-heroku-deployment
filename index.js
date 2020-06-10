/** @format */

const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const socket = require("socket.io");

dotenv.config();

mongoose.connect(
  process.env.DB_CONNECT,
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => {
    console.log("connected to db");
  }
);

// import routes
const userRoutes = require("./routes/user");

// route middlewares
app.use(express.json());
app.use(cors());

// route middleware
app.use("/api/user", userRoutes);

// front end app path
app.use(express.static("public"));

const server = app.listen(3030, () => {
  console.log(`App listening on port 3030`);
});

// Socket setup
const io = require("socket.io")(server);

// Listen for new connection and print a message in console
io.on("connection", (socket) => {
  console.log(`New socket connection ${socket.id}`);

  socket.on("chat", function (data) {
    io.sockets.emit("chat", data);
  });

  socket.on("typing", function (data) {
    io.sockets.emit("typing", data);
  });
});
