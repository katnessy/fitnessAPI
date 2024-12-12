const express = require("express");
const workoutController = require("../controllers/workout.js");
const { verify } = require("../auth.js");

// Router
const router = express.Router();

router.post("/addWorkout", verify, workoutController.addWorkout);
router.get("/getMyWorkouts", verify, workoutController.getAllWorkouts);

// Routes with parameter:
router.patch("/updateWorkout/:workoutId", verify, workoutController.updateWorkout);
router.delete("/deleteWorkout/:workoutId", verify, workoutController.deleteWorkout);
router.patch("/completeWorkoutStatus/:workoutId", verify, workoutController.completeWorkout);


// Export the router
module.exports = router;