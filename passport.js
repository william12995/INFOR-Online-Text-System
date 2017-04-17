// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var nodemailer = require('nodemailer');
var randomstring = require('randomstring');
var bcrypt   = require('bcrypt-nodejs');
var crypto = require('crypto');

// load up the user model
var User = require('./models/user');
var mongodb = require('./models/db');
var credentials = require('./credentials');

var smtpTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    secure: true,
    port: 465,
    auth: {
        user: credentials.gmail.user,
        pass: credentials.gmail.pass,
    },
});

// expose this function to our app using module.exports
module.exports = function(passport) {

    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'name',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.name' :  username }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('error', 'That email is already taken.'));
            } else {

                // if there is no user with that email
                // create the user
                var newUser = new User();

                var md5 = crypto.createHash('md5');
                var email_MD5 = md5.update(req.body.email.toLowerCase()).digest('hex');
                var head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48";
                // set the user's local credentials
                newUser.name = username;
                newUser.email    = req.body.email;
                newUser.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
                newUser.head = head;
                newUser.isVerified = false;
                newUser.verifyId = randomstring.generate(15);

                let link = 'http://' + req.get('host') + '/verify?id=' + newUser.verifyId;
                let mailOptions = {
                    from: 'INFOR-Online-test <do-not-reply@infor.org>',
                    to: newUser.email,
                    subject: 'Confirm your email account',
                    html: 'Click this link to verify your email account.<br><a href="'+link+'">Click here to verify</a>'
                }

                //console.log(mailOptions);

                smtpTransport.sendMail(mailOptions, function(err, res) {
                    if(err){
                        return console.error('Cannot send email: ' + err);
                    }
                    console.log('Mail sent: ' + newUser.email);
                });

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    req.session.user = newUser;
                    return done(null, newUser);
                });

            }

        });

        });

    }));

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'name',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'name' :  username }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err){
                return done(err);
            }
            // if no user is found, return the message
            if (!user){
                return done(null, false, req.flash('error', 'No user found.'));
            }
            // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if ( ! ( bcrypt.compareSync(password, user.password) ) ){
                return done(null, false, req.flash('error', 'Oops! Wrong password.'));
            }
            // create the loginMessage and save it to session as flashdata
            req.session.user = user;
            // all is well, return successful user

            return done(null, user);
        });


    }));

    passport.use('facebook-login', new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID            : credentials.facebookAuth.ID,
        clientSecret        : credentials.facebookAuth.Secret,
        callbackURL         : credentials.facebookAuth.callbackURL,
        // passReqToCallback   : true,
        profileFields       : ['id', 'name', 'gender', 'email', 'picture.type(large)', 'link'],
        passReqToCallback : true
    },

    // facebook will send back the token and profile
    function(req, token, refreshToken, profile, done) {

        // console.log('call facebook-login');
        // console.log('token: ', token);
        // console.log('refreshToken: ', refreshToken);
        console.log('profile: ', profile);
        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            User.findOne({
               'name' : profile.name.givenName + ' ' + profile.name.familyName
             }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    req.session.user = user;
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser = new User();

                    // set all of the facebook information in our user model
                    // set the users facebook id
                    // we will save the token that facebook provides to the user
                    newUser.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                    newUser.isVerified = true;
                    newUser.head = profile.photos[0].value;

                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        User.findOne({'name': newUser.name},function(err, user){

                            req.session.user = user;
                            return done(null, newUser);
                        });
                    });
                }
            });

        });

    }));

};
