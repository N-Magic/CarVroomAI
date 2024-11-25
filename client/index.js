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
const gas = 0;
const steering = 0;

let friction = 0.02;

class vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class car {
  constructor(pos, velocity, accelleration, id) {
    this.pos = new vector(pos.x, pos.y);
    this.velocity = new vector(velocity.x, velocity.y);
    this.accelleration = new vector(accelleration.x, accelleration.y);
    this.id = id;
  }
  update() {
    if (this.accelleration.x >= 1) {
      this.accelleration.x = 1;
    }
    if (this.accelleration.y >= 1) {
      this.accelleration.y = 1;
    }
    this.velocity.x += this.accelleration.x;
    this.velocity.y += this.accelleration.y;
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
    cars.push(
      new car(new vector(800, 200), new vector(0, 0), new vector(0, 0), id),
    );
  }
});

// The following functions use keys to control the desired inputs, can be forgoed to have ai control the inputs
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
  // console.log(steering + " " + gas);
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
  // console.log(steering + " " + gas);
};

CarPic.onload = () => {
  requestAnimationFrame(gameLoop);
  // console.log(CarPic.width); - 256
  // console.log(CarPic.height); - 256
  // carPositioning();
};

function gameLoop() {
  for (let i = 0; i < cars.length; i++) {
    car = cars[i];
    ctx.save();
    ctx.translate(car.pos.x, car.pos.y);
    ctx.rotate(Math.atan(car.accelleration.y / car.accelleration.x));
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
