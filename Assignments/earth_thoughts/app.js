var express = require("express"),
    bodyParser = require("body-parser"), //used to parse incoming request from the client.
    mysql = require("mysql"), //Node JS driver for MySQL.
    flash = require("connect-flash"),//used to send flash messages to the view
    passport = require("passport"), //Passport module is a NodeJS module used as authentication middleware
    LocalStrategy = require("passport-local"),//This NodeJS module used to authenticate using a username and password.
    session = require("express-session"),
    path = require("path"),
    app = express(),
    dbConfig = require("./config/config");


//database connection
var con = mysql.createConnection(dbConfig);
con.connect(function(err) {
  if (err) throw err;
  // console.log('You are now connected to database...');
})

//requiring routes
var indexRoutes      = require("./routes/index"),
    earththoughtRoutes = require("./routes/earth_thoughts");


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set("view engine", "ejs"); // configure template engine
app.use(express.static(__dirname + "/public"));// configure express to use public folder
app.use(flash());


// PASSPORT CONFIGURATION
app.use(session({ //session secret
  secret: "keyboard cat!",
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
require("./config/passport")(passport);

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.session = req.session;
  next();
});
//index routes
app.use("/", indexRoutes);
app.use("/earth_thoughts", earththoughtRoutes);

//start the server in the port 3000!
app.listen(process.env.PORT || 3000, function(){
  console.log("The Earth Thoughts Server Has Started!");
});


// var request = require("request");

//   request('https://www.reddit.com/r/EarthPorn/.json',function(err,res,body){
//     if (!err && res.statusCode == 200) {
//       var obj = JSON.parse(body);

//       var data = obj.data.children;
//       data.forEach(function(item){
//           var origiurl=item.data.preview.images[0].source.url;
//           var imageurl= origiurl.replace('amp;','');
//           var thumbnail= item.data.thumbnail;

//           con.query("INSERT INTO earthporn (imageurl,thumbnail) VALUES (?,?)",[imageurl,thumbnail], function(err,result){
//             if (err) throw err;
//             console.log("Added successful");
//           })

//       });
//     }
//   })
