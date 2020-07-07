const express = require("express");
const logger = require("morgan");
const path = require("path");
const Model = require("./models/model.js");
const mongoose = require("mongoose");


const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// const databaseUrl = "workoutTracker";
// const collections = ["exercises"];

// mongoose.db.connect(databaseUrl, collections);
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout-tracker", { useNewUrlParser: true });

// db.on("error", error => {
//     console.log("Database Error:", error);
// });

//HTML route to app index/homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "./public/index.html"));
});

//HTML route to stats page
app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/stats.html"));
});

//HTML route to exercise page
app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/exercise.html"));
});

//API route to append request body to exercise array then send updated workout
app.put("/api/workouts/:id", (req, res) => {

});

//API route for sending array of the seven most recent workouts
app.get("/api/workouts/range", (req, res) => {
    //very similar to other get route; maybe .sort or something similar
    Model.find({}) //split models into multiple files?
        .sort({ date: -1 })
        .limit(7)
        .then(dbFitness => {
            res.json(dbFitness);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});

//API route to send arrays of all workouts
app.get("/api/workouts", (req, res) => {

    Model.find({}) //split models into multiple files?
        .sort({ date: -1 })
        .then(dbFitness => {
            res.json(dbFitness);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});

//API route to add new workout and send 
app.post("/api/workouts", (req, res) => {
    console.log(req.body);

    Model.create(req.body, (error, data) => {
        if (error) {
            res.send(error);
        } else {
            res.send(data);
        }
    });
});

app.listen(3000, () => {
    console.log("App running on port 3000!");
});