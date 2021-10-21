const Hero = require('../models/heroModel');
const Offer = require('../models/offerModel');
const Product = require('../models/productModel');
//home
exports.getHome = async (req, res, next) => {
  let successMessage = req.flash('success');
  successMessage = successMessage.length > 0 ? successMessage[0] : null;

  const hero_data = await Hero.find({});
  const offer_data = await Offer.find({});

  console.log("DATA",hero_data,offer_data);

  const prodShirts = await Product.find({
    prodType: 'Shirt',
  }).limit(4);
  const prodKurtas = await Product.find({
    prodType: 'Kurta',
  }).limit(4);
  res.render('pages/home', {
    pageTitle: 'Home',
    user: req.user,
    prodShirts: prodShirts,
    prodKurtas: prodKurtas,
    Hero: hero_data,
    Offer: offer_data,
    successMessage: successMessage,
  });
};
//About
exports.getAbout = (req, res, next) => {
  res.render('pages/about', {
    pageTitle: 'About',
    user: req.user,
  });
};
//Contact
exports.getContact = (req, res, next) => {
  res.render('pages/contact', {
    pageTitle: 'Contact Us',
    user: req.user,
  });
};

exports.getShop = async (req, res, next) => {
  console.log(req.query);
  // console.log(req.query.price.split('-'));
  // Checking if price exists
  if (req.query.price) {
    var [price1, price2] = req.query.price.split('-');
  } else {
    price1 = 100;
    price2 = 10000;
  }

  // Checking if color exists
  if (req.query.color) {
    var color = req.query.color;
  }
  if (req.query.color) {
    var product = await Product.find({
      $and: [
        { prodType: req.query.sort ? req.query.sort : 'Shirt' },
        { 'subcategory.size.price.0': { $gte: price1 } },
        { 'subcategory.size.price.0': { $lte: price2 } },
        { 'subcategory.color.name': color },
      ],
    }).sort({ 'subcategory.size.price.0': 1 });
  } else {
    var product = await Product.find({
      $and: [
        { prodType: req.query.sort ? req.query.sort : 'Shirt' },
        { 'subcategory.size.price.0': { $gte: price1 } },
        { 'subcategory.size.price.0': { $lte: price2 } },
      ],
    }).sort({ 'subcategory.size.price.0': 1 });
  }

  // console.log(product.length);

  res.render('pages/shop', {
    prods: product,
    pageTitle: 'All Products',
    path: '/products',
    query: req.query.sort,
    price: [price1, price2],
    user: req.user,
  });
};

exports.getProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.productId);
  if (
    product.subcategory.color.images &&
    product.subcategory.color.images[0] !== ''
  ) {
    var images1 = product.subcategory.color.images;
  }

  var s1 = product.subcategory.size.val;
  var p1 = product.subcategory.size.price;

  var size1 =
    s1.length >= 5
      ? [s1[0], s1[1], s1[2], s1[3], s1[4]]
      : [] || s1.length >= 4
      ? [s1[0], s1[1], s1[2], s1[3]]
      : [] || s1.length >= 3
      ? [s1[0], s1[1], s1[2]]
      : [] || s1.length >= 2
      ? [s1[0], s1[1]]
      : [] || [s1[0]];
  var price0 =
    p1.length >= 5
      ? [p1[0], p1[1], p1[2], p1[3], p1[4]]
      : [] || p1.length >= 4
      ? [p1[0], p1[1], p1[2], p1[3]]
      : [] || p1.length >= 3
      ? [p1[0], p1[1], p1[2]]
      : [] || p1.length >= 2
      ? [p1[0], p1[1]]
      : [] || [p1[0]];
  const color = product.subcategory.color.name;
  res.render('pages/shop-detail', {
    pageTitle: 'Shop-Detail',
    product: product,
    images1: images1,
    size1,
    price0,
    color,
    user: req.user,
  });
};
