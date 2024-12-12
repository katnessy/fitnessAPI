const express = require("express");
const userController = require("../controllers/user.js");
const { verify, isLoggedIn } = require("../auth.js");

// Router
const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/details", verify, userController.getProfile);


router.get("/success", isLoggedIn, (req, res) => {
	console.log("You are logged in");
	console.log(req.user);
	res.send(`Welcome ${req.user.displayName}`);
})


// Export the router
module.exports = router;