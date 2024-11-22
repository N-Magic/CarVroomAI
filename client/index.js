const socket = io();
const canvas = document.getElementById("display");
const ctx = canvas.getContext("2d");
const wordsSpot = document.getElementById("wordSpot");

const players = {};

socket.on("init", (data) => {
  wordsSpot.innerText();
});

canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  socket.emit("updatePosition", { x, y });
});
