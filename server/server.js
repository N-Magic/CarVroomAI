const express = require("express");
app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const path = require("path");

app.use(express.static(path.resolve(__dirname, "../client")));

let id = 0;

io.on("connection", (socket) => {
  console.log("user connected");
  io.emit("id", id);
  id++;
});

server.listen(3000, () => {
  console.log("server running on port 3000");
});

// const { createServer } = require("node:http");

// const hostname = "127.0.0.1";
// const port = 3000;

// const server = createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader("Content-Type", "text/plain");
//   res.end("Hello World");
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });
