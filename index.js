const express = require('express');
const env = require('./config/environment');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./config/mongoose.js');
const app = express();
const path = require('path');
const port = 8000;

const expressLayouts = require('express-ejs-layouts');
app.use(express.urlencoded());
app.use(cookieParser());
//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy.js');
const passportGoogle = require('./config/passport-google-oauth2-strategy.js');
const gulp = require('gulp');
app.use(express.static('assets'));
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode, env.morgan.options));

// set up the view engine 
app.set('view engine', 'ejs');
app.set('views', './views');

app.set('layout', './layouts');
app.use(expressLayouts);


const flash = require('connect-flash');
const customMware = require('./config/middleware');

// set up the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets.js').chatSockets(chatServer);

chatServer.listen(5000);
console.log('chat server is listening on port 5000');


const MongoStore = require('connect-mongo');
const expressEjsLayouts = require('express-ejs-layouts');
const { Socket } = require('socket.io');
app.use(session({
    name:"signup",
    secret: env.session_cookie_key,
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store: MongoStore.create({
        mongoUrl: `mongodb://127.0.0.1:27017/${env.db}`,
        autoRemove:'disabled' 
    },
        function(err){
            console.log(err || 'connect-mongodb setup ok');
        }
    )
}));



app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

app.use(cors({
    origin: '*'
  }));

app.use('/', require('./routes/index.js'));


app.listen(port, function(err){
    if(err){
        console.log("Error connecting to the server");
        return;
    }
    console.log(`Server is running at port: ${port}`);
})




