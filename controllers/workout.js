const Workout = require("../models/Workout.js");
const bcrypt = require("bcryptjs");

const { errorHandler } = require("../auth.js")


module.exports.addWorkout = (req, res) => {
  const newWorkout = new Workout({
    name: req.body.name,
    duration: req.body.duration,
    status: req.body.status || "pending", 
  });

  newWorkout
    .save()
    .then((result) => {
      return res.status(201).send({
        userId: result._id,
        name: result.name,
        duration: result.duration,
        status: result.status,
        _id: result._id,
        dateAdded: result.createdAt, 
        __v: result.__v,
      });
    })
    .catch((err) => errorHandler(err, req, res));
};

module.exports.getAllWorkouts = (req, res) => {
  Workout.find({})
    .then((workouts) => {
      if (workouts.length === 0) {
        return res.status(404).send({ message: "No workouts found" });
      }
      return res.status(200).send({ workouts });
    })
    .catch((err) => errorHandler(err, req, res));
};

module.exports.updateWorkout = (req, res) => {
  const workoutId = req.params.workoutId;
  const updatedData = {
    name: req.body.name,
    duration: req.body.duration,
    status: req.body.status,
  };

  Workout.findByIdAndUpdate(workoutId, updatedData, { new: true})
    .then((updatedWorkout) => {
      if (!updatedWorkout) {
        return res.status(404).send({ message: "Workout not found" });
      }
      return res.status(200).send({
        message: "Workout updated successfully",
        updatedWorkout,
      });
    })
    .catch((err) => errorHandler(err, req, res));
};

module.exports.deleteWorkout = (req, res) => {
  const workoutId = req.params.workoutId;

  Workout.findByIdAndDelete(workoutId)
    .then((deletedWorkout) => {
      if (!deletedWorkout) {
        return res.status(404).send({ message: "Workout not found" });
      }
      return res.status(200).send({
        message: "Workout deleted successfully",
      });
    })
    .catch((err) => errorHandler(err, req, res));
};

module.exports.completeWorkout = (req, res) => {
  const workoutId = req.params.workoutId;

  Workout.findByIdAndUpdate(
    workoutId,
    { status: "completed" },
    { new: true, runValidators: true }
  )
    .then((updatedWorkout) => {
      if (!updatedWorkout) {
        return res.status(404).send({ message: "Workout not found" });
      }

      return res.status(200).send({
        message: "Workout marked as completed",
        updatedWorkout: {
          _id: updatedWorkout._id,
          userId: updatedWorkout._id,
          name: updatedWorkout.name,
          duration: updatedWorkout.duration,
          status: updatedWorkout.status,
          dateAdded: updatedWorkout.dateAdded,
          __v: updatedWorkout.__v,
        },
      });
    })
    .catch((err) => errorHandler(err, req, res));
};