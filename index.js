// Dependencies and Modules
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/user.js");
const workoutRoutes = require("./routes/workout.js");


// Configure dotenv:
dotenv.config();

const app = express();


// Database:
mongoose.connect(process.env.MONGODB_STRING);

// Status of the connection:
let db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection Error!"));
db.once("open", () => console.log("Now connected to MongoDB Atlas."));



// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const corsOptions = {
	origin: ['http://localhost:8000'],
	credentials: true, // allow credentials example cookies, authorized headers
	optionsSuccessStatus: 200
}

app.use(cors(corsOptions));


// Backend route for the users request:
app.use("/users", userRoutes);
app.use("/workouts", workoutRoutes);

// Checking and running server
if(require.main === module) {
	app.listen(process.env.PORT || 3000, () => {
		console.log(`API is now online on port ${process.env.PORT || 3000}`);
	});
}

module.exports = { app, mongoose };