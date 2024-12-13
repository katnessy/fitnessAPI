const User = require("../models/User.js");
const Workout = require("../models/Workout.js");
const bcrypt = require("bcryptjs");
const { createAccessToken, errorHandler } = require("../auth.js")

// Functions for user request will be placed here
module.exports.registerUser = (req, res) => {
	let newUser = new User({
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 10),
	});
	
	if(!newUser.email.includes("@")){
		return res.status(400).send({message: 'Invalid email format'});
	}
		
	if(typeof req.body.password !== "string" || req.body.password.length < 8) {
		return res.status(400).send({message: 'Password must be at least 8 characters long'});
	}
	
	return newUser.save()
	.then(result => res.status(201).send({
		message: 'User registered successfully'	}))
	.catch(err => errorHandler(err, req, res));
};

module.exports.loginUser = (req, res) => {
	if(req.body.email.includes("@")) {
		return User.findOne({email: req.body.email})
		.then(result => {

			if(result === null) {
				return res.status(404).send({message: 'No email found'});
			}

			else {
				const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

				if(isPasswordCorrect) {
					return res.status(200).send({
						access: createAccessToken(result)
					});
				} else {
					return res.status(401).send({message: 'Incorrect email or password'});
				}
			}
		})
		.catch(err => errorHandler(err, req, res));
	} else {
		return res.status(400).send({message: 'Invalid email format'});
	}
}

module.exports.getProfile = (req, res) => {
	return User.findOne({_id: req.user.id})
	.select("-password")
	.then(result => {
		if(result){
	        return res.status(200).send({ user: result });
		}else{
			return res.status(404).send({message: 'User not found'});
		}
	})
	.catch(err => errorHandler(err, req, res));
};
