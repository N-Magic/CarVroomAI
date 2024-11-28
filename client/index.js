const socket = io();
const canvas = document.getElementById("display");
const ctx = canvas.getContext("2d");
const wordsSpot = document.getElementById("wordSpot");
var CarPic = new Image();
CarPic.src = "./Car.png";

let id = 9999;
let cars = [];

const leftKey = 37;
const upKey = 38;
const rightKey = 39;
const downKey = 40;
let gas = 0;
let steering = 0;

let friction = 0.1;
let defaultAcceleration = 1.5;

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

socket.on("connect", (data) => {
  wordsSpot.innerText = "initialized";
  socket.emit("init");
});
socket.on("id", (idin) => {
  if ((id = 9999)) {
    id = idin;
    wordsSpot.innerText = id;
    let myCar = new car(
      new vector(800, 200),
      0,
      new vector(0, 0),
      new vector(0, 0),
      0,
      0,
      id,
      true,
    );
    cars.push(myCar);
    socket.emit("newCar", myCar);
  }
});

canvas.onkeydown = function (e) {
  if (e.keyCode == leftKey) {
    steering = -1;
  }
  if (e.keyCode == upKey) {
    gas = 1;
  }
  if (e.keyCode == rightKey) {
    steering = 1;
  }
  if (e.keyCode == downKey) {
    gas = -1;
  }
};
canvas.onkeyup = function (e) {
  if (e.keyCode == leftKey) {
    if (steering == -1) {
      steering = 0;
    }
  }
  if (e.keyCode == upKey) {
    if (gas == 1) {
      gas = 0;
    }
  }
  if (e.keyCode == rightKey) {
    if (steering == 1) {
      steering = 0;
    }
  }
  if (e.keyCode == downKey) {
    if (gas == -1) {
      gas = 0;
    }
  }
};

CarPic.onload = () => {
  requestAnimationFrame(gameLoop);
};

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < cars.length; i++) {
    car = cars[i];

    if (car.id == id) {
      car.gas = gas;
      car.steering = steering;
    }
    car.update();
    ctx.save();
    ctx.translate(car.pos.x, car.pos.y);
    ctx.rotate(((car.angle + 90) * Math.PI) / 180);
    ctx.drawImage(CarPic, -26 - 16, -6 - 35, 85, 85);
    ctx.restore();
  }

  requestAnimationFrame(gameLoop);
}

// function carPositioning() {
//   let carX = 200;
//   let carY = 0 + 50;
//   let carAngle = 0;
//   ctx.restore();
//   ctx.translate(carX, carY);
//   ctx.rotate((carAngle * Math.PI) / 180);
//   ctx.drawImage(CarPic, -26 - 16, -6 - 35, 85, 85);
// }
