var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");
    
    
mongoose.connect("mongodb://localhost/auth_demo_app");

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.use(require("express-session")({
    secret: "Man, I should probably change these secrets to something not public",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ============
// ROUTES
// ============

app.get("/", function(req, res){
    res.render("home");
});

app.get("/appselection", isLoggedIn, function(req, res){
    res.render("appselection");
});

// auth routes

// show sign up form
app.get("/register", function(req, res){
    res.render("register");
});

// handling user signup
app.post("/register", function(req, res){
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
       if(err){
           console.log(err);
           return res.render('register');
       }
       passport.authenticate("local")(req, res, function(){
           res.redirect("/appselection");
       });
    });
});

// LOGIN ROUTES

// render login form
app.get("/login", function(req, res){
    res.render("login");
});

// login logic
// middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/appselection",
    failureRedirect: "/login"
}) , function(req, res){
        
});

// logout
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

// AWS http server start (using nginx to route port 80 -> 3000)
app.listen(3000, function(){
    console.log("Sandbox server started.")
});

// server start for c9 debugging
// app.listen(process.env.PORT, process.env.IP, function(){
//     console.log("Sandbox server started.");
// });

