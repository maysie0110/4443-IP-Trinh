var express = require("express");
var router = express.Router();
var mysql = require("mysql"), //Node JS driver for MySQL.
    dbConfig = require("../config/config");
var middleware = require("../middleware");
var Favorite = require("../models/favorites");
//database connection
var con = mysql.createConnection(dbConfig);
con.connect(function(err) {
    if (err) throw err;
});

//INDEX - show earth thoughts index 
router.get("/", function(req, res){
    let query = "SELECT * FROM earth_thoughts"; // query database to get all the earth thoughts

    // execute query
    con.query(query, (err, result) => {
        if (err) {
            res.redirect('/');
        }
        res.render("earth_thoughts/index", {earth_thoughts: result});
    });
});


//NEW - show form to create new earth thoughts
//this is protected, you have to be logged in to create new
router.get("/new",middleware.isLoggedIn, function(req, res){
    con.query("SELECT * FROM earthporn", function(err,result){
        if(err){
            res.redirect("/");
        }
        res.render("earth_thoughts/new",{earthporns: result}); 
    })
 });

//CREATE - add new earth thoughts to DB
router.post("/",middleware.isLoggedIn, function(req, res){

    var url= req.body.image;
    var thoughts= req.body.thoughts;
    
    con.query("INSERT INTO earth_thoughts (url, thoughts) VALUES ('" + url + "', '" +thoughts+ "')", function(err,result){
    // con.query("INSERT INTO earth_thoughts (url, thoughts) VALUES (?,?)", [url],[thoughts], function(err,result){
        if(err){
            console.log(err);
        } 
        // if (err) throw err;
        else {
            //redirect back to home page
            req.flash("success","Added successfully!");
            res.redirect("/earth_thoughts");
        }
    });
});
// SHOW - 
router.get("/:id", function(req, res){
    var id = req.params.id;

    //find the earth_thoughts with provided ID
    con.query("SELECT * FROM earth_thoughts WHERE id = ?",[id], function (err, result) {
        if (err) throw err;
        for (var i in result) {
            console.log(result[i]);
        }
        //render show template with that item
        res.render("earth_thoughts/show",{earth_thoughts:result[0]});
    });
});


router.get("/favorites/:id", function (req,res){
    var imgID = req.params.id;
    var favorite = new Favorite(req.session.favorite ? req.session.favorite : {items:{},totalQty:0});

    con.query("SELECT * FROM earth_thoughts WHERE id = ?",[imgID], function (err, result) {
        if (err) throw err;
        favorite.add(result[0],result[0].id);
        req.session.favorite = favorite;
        console.log(req.session.favorite);
        res.redirect("/earth_thoughts");
    });
});

// router.get("/favorites",middleware.isLoggedIn, function (req,res){
//     console.log(req.sesssion.favorite);
//     // if(!req.sesssion.favorite){
//     //     return res.render("earth_thoughts/favorite", {earth_thoughts:null});
//     // }
//     // var favorite = new Favorite(req.session.favorite);
    
//     // res.render("earth_thoughts/favorite",{earth_thoughts:favorite.generateArray()});
//     res.render("earth_thoughts/index")
// });


module.exports = router;
