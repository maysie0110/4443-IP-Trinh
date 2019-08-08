var LocalStrategy = require('passport-local').Strategy;
var mysql = require("mysql");
var bcrypt = require("bcrypt");
var dbConfig = require("./config");
const BCRYPT_SALT_ROUNDS = 12;
//database connection
var connection = mysql.createConnection(dbConfig);
connection.connect(function(err) {
    if (err) throw err;
});
// connection.end();

 module.exports = function(passport){
  // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
      done(null, user.id);
  });
    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
    //   connection.connect();
      connection.query("SELECT * FROM people WHERE id = ? ",[id], function(err, rows){
          done(err, rows[0]);
      });
    //   connection.end();
    });



    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    passport.use(
      'local-signup',
      new LocalStrategy({
          // by default, local strategy uses username and password
          usernameField : 'username',
          passwordField : 'password',
          passReqToCallback : true // allows us to pass back the entire request to the callback
      },
      function(req, username, password, done) {
        // find a user whose username is the same as the forms username
        // we are checking to see if the user trying to login already exists
        // connection.connect();
        connection.query("SELECT * FROM people WHERE username = ?",[username], function(err, rows) {
            if (err)
                return done(err);
            if (rows.length) {
                return done(null, false, req.flash('error', 'That username is already taken.'));
            } else {
                // if there is no user with that username
                // create the user
                var newUserMysql = {
                    username: username,
                    password: bcrypt.hashSync(password, BCRYPT_SALT_ROUNDS) // use the generateHash function in our user model
                };
           
                var insertQuery = "INSERT INTO people ( username, password ) values (?,?)";

                // connection.connect();
                connection.query(insertQuery,[newUserMysql.username, newUserMysql.password],function(err, rows) {
                    if (err) throw err;
                    // console.log(rows);
                    newUserMysql.id = rows.id;

                    return done(null, newUserMysql);
                });
                // connection.end();
            }
        });
        // connection.end();
      })
    );
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
      'local-login',
      new LocalStrategy({
          // by default, local strategy uses username and password
          usernameField : 'username',
          passwordField : 'password',
          passReqToCallback : true // allows us to pass back the entire request to the callback
      },
      function(req, username, password, done) { // callback with username and password from our form
        //   connection.connect();
          connection.query("SELECT * FROM people WHERE username = ?",[username], function(err, rows){
              if (err)
                  return done(err);
              if (!rows.length) {
                  return done(null, false, req.flash("error", 'No user found.')); // req.flash is the way to set flashdata using connect-flash
              }

              // if the user is found but the password is wrong
              if (!bcrypt.compareSync(password, rows[0].password))
                  return done(null, false, req.flash('error', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

              // all is well, return successful user
              return done(null, rows[0]);
          });
        //   connection.end();
      })
  );
 };
//  connection.end();