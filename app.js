const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const cors = require('cors');
const flash = require('connect-flash');

const User = require('./models/userModel');
const shopRoutes = require('./routes/shopRoutes');
const authRoutes = require('./routes/authRoutes');
const errorRoutes = require('./routes/error');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const heroRoutes = require('./routes/heroRoutes');
const offerRoutes = require('./routes/offerRoutes');
//const orderRoutes = require('./routes/OrderRoutes');


// Dotenv file
dotenv.config({
  path: './config.env',
});

// Mongodb url
const MONGODB_URI = `mongodb+srv://abhishek:${process.env.DB_PASSWORD}@cluster0.uc961.mongodb.net/libax?retryWrites=true&w=majority`;

// Express App
const app = express();

// Session configuration
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

// Csrf protection // works for post requests only
const csrfProtection = csrf();
// Flash-message
app.use(flash());

// view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
// app.use(bodyParser.json()); // parse application/json
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/prodImages', express.static(path.join(__dirname, 'prodImages')));
// Session Middleware
app.use(
  session({
    secret: 'JustArandomstring12345678910',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);

// for loading model functions
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      // console.log(req.user);
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

// Everytime User login's  (check postSign_In)
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Mounting routes
app.use('/admin', adminRoutes);
app.use(userRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use('/admin', offerRoutes);
app.use('/admin', heroRoutes);
app.use(errorRoutes);
//app.use(orderRoutes);

////<%- include('../includes/banner.ejs') %>


module.exports = app;
