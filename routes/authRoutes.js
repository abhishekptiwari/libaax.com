const express = require('express');
const authController = require('../Controllers/authController');
const { check, body } = require('express-validator');
const User = require('../models/userModel');
const router = express.Router();

router.get('/sign-in', authController.getSignIn);
router.post(
  '/sign-in',
  [
    check('email')
      .isEmail()
      .trim()
      .withMessage('Please enter a valid email!!')
      .normalizeEmail(),
    body('password', 'A password has to be valid').isLength({ min: 8 }).trim(),
  ],
  authController.postSign_In
);

router.get('/sign-up', authController.getSignUp);
router.post(
  '/sign-up',
  [
    check('fname', 'Please enter a valid name').trim().isAlpha('en-IN'),
    check('lname', 'Please enter a valid name').trim().isAlpha('en-IN'),
    check('email')
      .isEmail()
      .trim()
      .withMessage('Please enter a valid email')
      .normalizeEmail()
      .custom((value, { req }) => {
        // if (value === 'test@test.com') {
        //   throw new Error('This email address is forbidden');
        // }
        // return true;
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(
              'Email exists already, please pick a different one.'
            );
          }
        });
      }),
    body('password', 'A password must be 8 characters long')
      .isLength({
        min: 8,
      })
      .trim(),
  ],
  authController.postSign_Up
);

router.post('/logout', authController.postLogout);

module.exports = router;
