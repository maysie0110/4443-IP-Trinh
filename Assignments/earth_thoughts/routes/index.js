var express = require("express"),
    router = express.Router(),
    mysql   =require("mysql"),
    dbConfig = require("../config/config"),
    passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    bcrypt = require("bcrypt");

 const BCRYPT_SALT_ROUNDS = 12;

//database connection
var con = mysql.createConnection(dbConfig);
con.connect(function(err) {
    if (err) throw err;
});

//root route
router.get("/", function(req, res){
    res.render("landing");
});

// show register form
router.get("/register", function(req, res){
    res.render("register",{ message: req.flash('error') }); 
 });

//handle register logic
router.post("/register", passport.authenticate('local-signup',{
    successRedirect:'/earth_thoughts',
    failureRedirect:'/register',
    failureFlash:true,
    session: false
}));

 
//show login form
router.get("/login", function(req, res){
    res.render("login",{ message: req.flash('error') }); 
});
 
//handling login logic
router.post("/login", passport.authenticate("local-login",{
    successRedirect:"/earth_thoughts", // redirect to the secure profile section
    failureRedirect:"/login", //redirect back to login page if there is an error
    failureFlash: true //allow flash messages
}), function(req,res){
    console.log("Login Successful! Hello!");
    if(req.body.remember){
        req.session.cookie.maxAge = 1000*60*3;
    }else{
        req.session.cookie.expires = false;
    }
    res.redirect("/");
})

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "See you later!");
    res.redirect("/");
 });
 
 router.get("/about", function(req,res){
    res.render("about");  
 });
 router.get("/contact", function(req,res){
    res.render("contact");  
 })
module.exports = router;
