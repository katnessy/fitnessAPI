const express = require("express");
const Workout = require("../models/Workout.js")
const { errorHandler } = require('../auth.js')



module.exports.addWorkout = (req, res) => {
    let newWorkout = new Workout({
        userId : req.user.id,
        name : req.body.name,
        duration : req.body.duration,
    });

    return Workout.findOne({name: req.body.name}).then(existingWorkout => {

        if(existingWorkout){

            return res.status(409).send({ message:'Workout already exists' });
        } else{

            return newWorkout.save().then(result => res.status(201).send({
                success: true,
                message: "Workout added successfully",
                result
            })).catch(error => errorHandler(error, req, res));
        }
    })
    .catch(error => errorHandler(error, req, res));
}; 

module.exports.getMyWorkouts = (req, res) => {
    return Workout.find({userId: req.user.id})
        .then(workouts => {
            if (workouts.length > 0) {
                return res.status(200).send({workouts:workouts});
            }
            return res.status(404).send({
                message: 'No workouts found'
            });
        })
        .catch(error => errorHandler(error, req, res));
};

module.exports.updateWorkout = (req, res)=>{
    let updatedWorkout = {
      name: req.body.name,
      duration: req.body.duration
    };

    return Workout.findByIdAndUpdate(req.params.workoutId, updatedWorkout, {new:true})
    .then(workout => {

        if (workout) {

            return res.status(200).send({
                message : 'Workout updated successfully',
                updatedWorkout: workout});

        } else {

           return res.status(404).send({message : 'No Workout found'});
        }
    })
    .catch(error => errorHandler(error, req, res));
};



module.exports.deleteWorkout = (req, res) => {

    return Workout.findByIdAndDelete(req.params.workoutId)
    .then(workout => {
        if(workout) {
            res.status(200).send({message:"Workout deleted successfully"})
        }else{
            res.status(404).send({message:"Workout not found"})
        }


   

}).catch(error => errorHandler(error, req, res));
};


module.exports.completeWorkoutStatus = (req, res) => {

    let completeWorkout = {
        status: "completed"
    };

    return Workout.findById(req.params.workoutId)
        .then(workout => {
            if (!workout) {
                return res.status(404).send({ message: 'Workout not found' });
            }
            if (workout.status === "completed") {
                return res.status(200).send({ message: 'Workout already completed' });
            }

            return Workout.findByIdAndUpdate(req.params.workoutId, completeWorkout, { new: true })
                .then(updatedWorkout => {
                    res.status(200).send({
                        message: 'Workout status updated successfully',
                        updatedWorkout: updatedWorkout
                    });
                });
        })
        .catch(error => errorHandler(error, req, res));
};