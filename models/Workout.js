const mongoose = require("mongoose");

// Schema/Blueprint
const workoutSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Name is Required"]
	},
	duration: {
		type: String,
		required: [true, "Duration is Required"]
	},
	status: {
		type: String,
		default: "pending"
	},
	dateAdded: {
		type: Date,
		default: Date.now
	}
});

// Model
module.exports = mongoose.model("Workout", workoutSchema);