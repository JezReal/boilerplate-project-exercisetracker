const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
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

  users.push({ username: request.body.username, _id: uuid });

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
  const userId = request.params["id"];

  if (!request.body.date) {
    date = DateTime.now().setZone("Asia/Manila");
  } else {
    date = DateTime.fromJSDate(new Date(request.body.date)).setZone(
      "Asia/Manila"
    );
  }

  exercises.push({
    _id: request.body[":_id"],
    description: request.body["description"],
    duration: request.body["duration"],
    date: date,
  });

  const username = getUsernameById(userId);

  response.json({
    username: username,
    description: request.body["description"],
    duration: request.body["duration"],
    date: date.toFormat("ccc LLL dd y"),
    _id: request.body[":_id"],
  });
});

app.get("/api/users/:id/logs", (request, response) => {
  const userId = request.params["id"];
  const start = request.query["from"];
  const end = request.query["to"];
  const limit = request.query["limit"];
  let userExerciseLogs = [];

  const username = getUsernameById(userId);

  users.forEach((user) => {
    console.log(user.username);
  });

  if (start && end && limit) {
    userExerciseLogs = getUserExerciseLogs(start, end, limit, userId);
  } else {
    userExerciseLogs = getUserExerciseLogs(null, null, null, userId);
  }

  response.json({
    username: username,
    count: userExerciseLogs.length,
    _id: userId,
    log: userExerciseLogs,
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

const getUsernameById = (userId) => {
  let username = "";

  users.forEach((user) => {
    if (user._id === userId) {
      username = user.username;
    }
  });

  return username;
};

const getUserExerciseLogs = (start, end, limit, userId) => {
  const userExerciseLogs = [];
  const formattedStart = DateTime.fromJSDate(new Date(start))
    .setZone("Asia/Manila")
    .toISODate();
  const formattedEnd = DateTime.fromJSDate(new Date(end))
    .setZone("Asia/Manila")
    .toISODate();

  if (!start && !end && !limit) {
    exercises.forEach((exercise) => {
      if (exercise._id === userId) {
        userExerciseLogs.push({
          description: exercise.description,
          duration: parseInt(exercise.duration),
          date: exercise.date.toFormat("ccc LLL dd y"),
        });
      }
    });
  } else {
    exercises.forEach((exercise) => {
      if (exercise._id === userId) {
        const exerciseStart = exercise.date.toISODate();
        const exerciseEnd = exercise.date.toISODate();

        if (
          exerciseStart >= formattedStart &&
          exerciseEnd <= formattedEnd &&
          userExerciseLogs.length < limit
        ) {
          userExerciseLogs.push({
            description: exercise.description,
            duration: parseInt(exercise.duration),
            date: exercise.date.toFormat("ccc LLL dd y"),
          });
        }
      }
    });
  }

  return userExerciseLogs;
};
