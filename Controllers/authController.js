const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

// get sign-in page
exports.getSignIn = (req, res, next) => {
  let message = req.flash('error');
  message = message.length > 0 ? message[0] : null;
  let successMessage = req.flash('success');
  successMessage = successMessage.length > 0 ? successMessage[0] : null;
  res.render('auth/sign-in', {
    pageTitle: 'Sign-In',
    user: req.user,
    errorMsg: message,
    onlyPassword: false,
    onlyEmail: false,
    oldInput: {
      email: '',
      password: '',
    },
    successMessage: successMessage,
  });
};

exports.postSign_In = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req); // Errors from routes
  // console.log(errors);
  if (!errors.isEmpty()) {
    // console.log(errors);
    return res.status(422).render('auth/sign-in', {
      pageTitle: 'Sign-in',
      successMessage: undefined,
      user: req.user,
      onlyPassword: false,
      onlyEmail: false,
      errorMsg: errors.array(),
      oldInput: {
        email: email,
        password: password,
      },
    });
  }
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      // console.log('No user Found with given email');
      return res.status(422).render('auth/sign-in', {
        pageTitle: 'Sign-in',
        successMessage: undefined,
        user: req.user,
        errorMsg: 'No user found with given email',
        onlyEmail: true,
        onlyPassword: false,
        oldInput: {
          email: email,
          password: password,
        },
      });
    }
    const isValidPassword = await bcrypt.compare(password, user.password); // boolean result
    if (!isValidPassword) {
      console.log('Incorrect Password');
      return res.status(422).render('auth/sign-in', {
        pageTitle: 'Sign-in',
        successMessage: undefined,
        user: req.user,
        errorMsg: 'Incorrect password',
        onlyPassword: true,
        onlyEmail: false,
        oldInput: {
          email: email,
          password: password,
        },
      });
    }
    // setting the session
    req.session.isLoggedIn = true;
    req.session.user = user;
    req.flash('success', 'Welcome User');
    return req.session.save(err => {
      //   console.log(err);
      res.redirect('/');
    });
  } catch (error) {
    console.log(error);
  }
};

// get sign-up page
exports.getSignUp = (req, res, next) => {
  let message = req.flash('error');
  message = message.length > 0 ? message[0] : null;
  console.log(message);
  res.render('auth/sign-up', {
    pageTitle: 'Sign-Up',
    user: req.user,
    errorMsg: message,
    oldInput: {
      email: '',
      password: '',
    },
  });
};

exports.postSign_Up = async (req, res, next) => {
  let { fname, lname, email, password } = req.body;
  const errors = validationResult(req); // Errors from routes
  // console.log(errors.array());
  if (!errors.isEmpty()) {
    // console.log(errors);
    return res.status(422).render('auth/sign-up', {
      style_two: false,
      pageTitle: 'Sign-up',
      errorMsg: errors.array(),
      user: req.user,
      oldInput: {
        fname: fname,
        lname: lname,
        email: email,
        password: password,
      },
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name: fname.concat(' ', lname),
      email: email,
      password: hashedPassword,
      cart: { items: [] },
    });
    await user.save();
    console.log('Signed In successfully');
    req.flash('success', 'Signed-In Successfully');
    return res.redirect('/sign-in');
  } catch (error) {
    console.log(error);
  }
};

// Delete the session-cookie
exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/sign-in');
  });
};
