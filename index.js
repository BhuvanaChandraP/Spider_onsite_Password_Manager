const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const User = require('./models/user');
const Account = require('./models/account');


checkAuth = async(req,res,next)=>{
    if(req.isAuthenticated()){
        return next()
    }
        req.flash("error", "Please Sign-in to view the page");
        res.redirect('/login');
}


mongoose.connect('mongodb://localhost:27017/onsite', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))



app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, 
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.get('/' ,(req,res)=>{
    res.redirect('/register')
})

app.get('/register', (req, res) => {
    try{
        res.render('register');
    }
    catch (err) {
        req.flash("error", "Unable to get register page");
        res.redirect("/register");
        console.log(err);
    }
});
app.post('/register' , async(req,res,next)=>{
    try{
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    // console.log(registeredUser);
    req.flash('success',"Successfully Registered");
    res.redirect('login'); 

    }
    catch(err){
        console.log(err);
    if (err.message == "A user with the given username is already registered") {
            req.flash("error", "Name is already in use");
    }
    else if (err.keyValue.email) {
      req.flash("error", "Email is already in use");
    } else if (err.keyValue.username) {
      req.flash("error", "Name is already in use");
    } else {
      req.flash("error", "Sorry! Unable to register");
    }
    res.redirect("/register");
  }   
})




app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/login', passport.authenticate('local', {failureFlash : true, failureRedirect: '/login'}), async (req, res) => { 
    n = req.user.username;
    res.render('home');
});


app.get("/home" , checkAuth , async(req,res)=>{
   res.render('home');
})

app.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success',"Successfully Logged Out");
    res.redirect('login');
})


app.listen(3030, () => {
    console.log('Listening on port 3030')
})

