const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { v4: uuidv4 } = require('uuid');
const { DateTime } = require("luxon");

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

app.post("/api/users/:id/exercises", (request, response) => {
  let date;
  let username;

  if (!request.body.date) {
    date = DateTime.now().setZone("Asia/Manila");
  } else {
    date = DateTime.fromJSDate(new Date(request.body.date)).setZone("Asia/Manila");
  }

  exercises.push({
    _id: request.body[':_id'],
    description: request.body['description'],
    duration: request.body['duration'],
    date: date
  });

  users.forEach((user) => {
    if (user._id === request.body[':_id']) {
      username = user.username;
    }
  });

  response.json({
    username: username,
    description: request.body['description'],
    duration: request.body['duration'],
    date: date.toFormat("ccc LLL dd y"),
    _id: request.body[':_id'],
  })
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
