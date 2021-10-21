const express = require('express');
const userController = require('../Controllers/userController');
const User = require('../models/userModel');
const { check } = require('express-validator');
const isAuth = require('../middleware/is-auth');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.get('/cart', isAuth, userController.getCart);

router.post('/cart', isAuth, userController.postCart);

router.post('/updated-cart', isAuth, userController.updateCart);

router.get('/profile', isAuth, userController.userProfile);

router.get('/edit-profile/:userId', isAuth, userController.getEditUserProfile);

router.post(
  '/edit-profile',
  isAuth,
  [
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
  ],
  userController.postEditUserProfile
);

router.get(
  '/edit-password/:userId',
  isAuth,
  userController.getEditUserPassword
);

router.post(
  '/edit-password',
  isAuth,
  [
    check('password')
      .isLength({ min: 8 })
      .withMessage('A password must be 8 characters long')
      .custom((value, { req }) => {
        return User.findOne({ email: req.user.email })
          .then(userDoc => {
            return bcrypt.compare(value, userDoc.password);
          })
          .then(isSame => {
            // console.log(isSame);
            if (isSame) {
              return Promise.reject(
                'Password is already used, please pick a different one.'
              );
            }
          });
      }),
  ],
  userController.postEditUserPassword
);

router.get('/get-Add-Address', isAuth, userController.getAddAddressForm);

router.post('/post-Add-Address', isAuth, userController.postAddAddressForm);

router.get('/my_orders', isAuth, userController.myOrders);

module.exports = router;
