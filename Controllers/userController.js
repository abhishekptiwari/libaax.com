const User = require('../models/userModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

// Show User Profile
exports.userProfile = async (req, res, next) => {
  let emailUpdateMessage = req.flash('emailUpdated');
  emailUpdateMessage =
    emailUpdateMessage.length > 0 ? emailUpdateMessage[0] : null;
  const userId = req.user._id;
  const doesAddressExist = await User.findOne({
    $and: [{ _id: userId }, { address: { $exists: true, $ne: null } }],
  });
  let pin_code, area, flat, landmark, city, state, phone;
  if (
    doesAddressExist.address.details &&
    doesAddressExist.address.details.length === 0
  ) {
    pin_code = '';
  } else {
    pin_code = doesAddressExist.address.details[0].pin_code;
    area = doesAddressExist.address.details[0].area;
    flat = doesAddressExist.address.details[0].flat;
    landmark = doesAddressExist.address.details[0].landmark;
    city = doesAddressExist.address.details[0].city;
    state = doesAddressExist.address.details[0].state;
    phone = doesAddressExist.phone_number;
  }
  const details = {
    pin_code,
    area,
    flat,
    landmark,
    city,
    state,
    phone,
  };
  res.render('pages/profile', {
    pageTitle: 'Profile ',
    user: req.user,
    doesAddressExist: doesAddressExist,
    details: details,
    emailUpdateMessage: emailUpdateMessage,
  });
};

// Get User Cart
exports.getCart = (req, res, next) => {
  // console.log(req.user);
  if (req.user.cart.items.length > 0) {
    req.user.removeFromCart();
    req.user
      .populate('cart.items.productId')
      .execPopulate()
      .then(user => {
        const products = user.cart.items;
        products.forEach(p => {
          if (p.productId === null) {
            req.user.clearCart();
          }
        });
        res.render('pages/cart', {
          pageTitle: 'Shopping Cart',
          products: products,
          user: req.user,
        });
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    console.log('No products found');
    res.render('pages/cart', {
      pageTitle: 'Shopping Cart',
      user: req.user,
      products: [],
    });
  }
};

// Add a product to cart
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  const selected_size = req.body.price;
  // console.log(selected_size);
  var size = selected_size.split('-')[0];
  var size_index = selected_size.split('-')[1];
  Product.findById(prodId)
    .then(product => {
      // console.log(product.subcategory.size.price[size_index]);
      var price = product.subcategory.size.price[size_index];
      return req.user.addToCart(product, size, price);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    });
};

// Update User's cart
exports.updateCart = async (req, res, next) => {
  const newquantity = req.body.newquantity;
  // console.log(newquantity);
  const user = await req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      for (let i = 0; i < products.length; i++) {
        products[i].quantity = newquantity[i];
      }
      user.save();
    });
  // await user.save();
  res.redirect('/cart');
};

// Editing User profile page(GET)
exports.getEditUserProfile = (req, res, next) => {
  let message = req.flash('error');
  message = message.length > 0 ? message[0] : null;
  const editMode = req.query.edit;
  try {
    if (!editMode) {
      return res.redirect('/profile');
    }
    return res.render('pages/edit-profile', {
      pageTitle: 'Update Email',
      path: '/pages/edit-profile',
      user: req.user,
      editing: editMode,
      errorMsg: message,
      oldInput: {
        email: '',
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// Edit user Profile
exports.postEditUserProfile = async (req, res, next) => {
  const userId = req.body.userId;
  const updatedEmail = req.body.email;
  const errors = validationResult(req); // Errors from routes
  console.log(errors.array());
  if (!errors.isEmpty()) {
    // console.log(errors);
    return res.status(422).render('pages/edit-profile', {
      style_two: false,
      pageTitle: 'Update Email',
      errorMsg: errors.array(),
      editing: true,
      user: req.user,
      oldInput: {
        email: updatedEmail,
      },
    });
  }
  User.findOneAndUpdate(
    { _id: userId },
    {
      email: updatedEmail,
    },
    function (err, doc) {
      if (err) {
        console.log(err);
      } else {
        console.log('User Email Updated Successfully');
      }
    }
  );
  req.flash('emailUpdated', 'Welcome User');
  res.redirect('/profile');
};

// GET Update Password
exports.getEditUserPassword = (req, res, next) => {
  const userId = req.params.userId;
  let message = req.flash('error');
  message = message.length > 0 ? message[0] : null;
  try {
    return res.render('pages/update-password', {
      pageTitle: 'Change Password',
      path: '/pages/edit-password',
      user: req.user,
      userId: userId,
      errorMsg: message,
      oldInput: {
        password: '',
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// POST update password
exports.postEditUserPassword = async (req, res, next) => {
  const userId = req.body.userId;
  const updatedPassword = req.body.password;
  const errors = validationResult(req); // Errors from routes
  console.log(errors.array());
  if (!errors.isEmpty()) {
    // console.log(errors);
    return res.status(422).render('pages/update-password', {
      pageTitle: 'Change Password',
      user: req.user,
      errorMsg: errors.array(),
      oldInput: {
        password: updatedPassword,
      },
    });
  }
  User.findOneAndUpdate(
    { _id: userId },
    {
      password: hashedPassword,
    },
    function (err, doc) {
      if (err) {
        console.log(err);
      } else {
        console.log('User Password Updated Successfully');
      }
    }
  );

  // res.redirect('/profile');
};

// Add Address form
exports.getAddAddressForm = async (req, res, next) => {
  const userId = req.user._id;
  const doesAddressExist = await User.findOne({
    $and: [
      { _id: userId },
      { address: { $exists: true, $ne: null } },
      { 'address.details': { $exists: true, $ne: [] } },
    ],
  });
  // console.log(doesAddressExist.address.details);
  res.render('pages/edit-address.ejs', {
    pageTitle: 'Select a delivery Address ',
    user: req.user,
    doesAddressExist: doesAddressExist,
  });
};

// Adding Address to database
exports.postAddAddressForm = (req, res, next) => {
  const phone_number = req.body.phone;
  const pin_code = req.body.pin;
  const area = req.body.area;
  const flat = req.body.flat;
  const landmark = req.body.landmark;
  const city = req.body.city;
  const state = req.body.state;
  // console.log(req.usesr.address)
  User.findByIdAndUpdate()
    .then(users => {
      return req.user.addAddress(
        phone_number,
        pin_code,
        area,
        flat,
        landmark,
        city,
        state
      );
    })
    .then(results => {
      res.redirect('/profile');
    });
};


// My previous Order
exports.myOrders = async (req, res, next) => {
  const orders = await Order.find(
    { 'user.userId': req.user._id },
  );
  // const order = await Order.find({'user.userId': req.user._id});
  console.log("my order: ", orders[0].totalAmount);
  res.render('pages/orders', {
    pageTitle: "My Order's",
    user: req.user,
    style_two: false,
    orders: orders,
  });
};