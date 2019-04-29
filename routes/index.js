var express	= require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground");
var Comment = require("../models/comment");


// show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

//show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

//Sign Up Logic
router.post("/register", function(req, res){
    var newUser = new User({
		username: req.body.username,
		firstName: req.body.firstName,
		lastName: req.body.lasttName,
		email: req.body.email,
		avatar: req.body.avatar
		});
    if(req.body.adminCode === 'tacos') {
      newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            return res.render("register", {"error": err.message});
        }
        passport.authenticate("local")(req, res, function(){
			req.flash("success", "Thanks for signing up, " + user.username);
          	res.redirect("/campgrounds"); 
        });
    });
});


//Show Login Form
router.get("/login", function(req, res){
	res.render("login");
});

//Login Logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds", 
	failureRedirect:"/login"
	}), function(req, res){
});

//Logout Route
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "You have logged out");
	res.redirect("/campgrounds");
});

//User Profiles
router.get("/users/:id", function(req,res){
	User.findById(req.params.id, function(err, foundUser){
		if (err){
			req.flash("error", "Something went wrong");
			res.redirect("/");
		}
		Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds){
			if (err){
				req.flash("error", "Something went wrong");
				res.redirect("/");
			}
			res.render("users/show", {user: foundUser, campgrounds: campgrounds});
		});
	});
});


module.exports = router;