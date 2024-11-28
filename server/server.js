const express = require("express");
app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const path = require("path");

app.use(express.static(path.resolve(__dirname, "../client")));

let id = 0;
let cars = [];

io.on("connection", (socket) => {
  console.log("user connected");
  io.emit("id", id);
  id++;
});

io.on("newCar", (myCar) => {
  cars.push(myCar);
  console.log(cars);
});

server.listen(3000, () => {
  console.log("server running on port 3000");
});

class vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class car {
  constructor(pos, angle, velocity, acceleration, gas, steering, id, life) {
    this.pos = new vector(pos.x, pos.y);
    this.angle = angle;
    this.velocity = new vector(velocity.x, velocity.y);
    this.acceleration = new vector(acceleration.x, acceleration.y);
    this.gas = gas;
    this.steering = steering;
    this.id = id;
    this.life = life;
  }
  update() {
    this.angle += steering * 5;
    if (this.angle >= 360) {
      this.angle -= 360;
    } else if (this.angle <= 0) {
      this.angle += 360;
    }
    this.acceleration.x =
      Math.cos((this.angle * Math.PI) / 180) * defaultAcceleration * gas;
    this.acceleration.y =
      Math.sin((this.angle * Math.PI) / 180) * defaultAcceleration * gas;
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;
    // let frictionAngle = Math.abs(this.angle);
    this.velocity.x *= 1 - friction;
    this.velocity.y *= 1 - friction;
    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;
  }
}
