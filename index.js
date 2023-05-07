const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { v4: uuidv4 } = require('uuid');

users = [];
exercises = [];

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", (request, response) => {
  const uuid = uuidv4();

  users.push({username: request.body.username, _id: uuid});

  response.json({
    username: request.body.username,
    _id: uuid,
  });
});

app.get("/api/users", (request, response) => {
  response.json(users);
});

app.post("/api/users/:id/exercises", (request, response) => {});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
