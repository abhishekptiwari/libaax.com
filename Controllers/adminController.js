const sharp = require('sharp');
const path = require('path');
const Product = require('../models/productModel');
const multer = require('multer');
const fs = require('fs');

// Storage KEY
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dir = './prodImages/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// middlewares
exports.upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
});

// Get the admin Dashboards
exports.getadminDashboard = async (req, res, next) => {
  res.render('admin/index.ejs');
};

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product.ejs', {
    editing: false,
    user: req.user,
  });
};

exports.postAddProduct = async (req, res, next) => {
  const name = req.body.name;
  const description = req.body.description;
  const prodType = req.body.prodtype;
  const images = req.files;
  const color = req.body.color;
  const imagesArr =
    images.length > 1
      ? [images[0].path, images[1].path, images[2].path]
      : ['', '', ''];
  const size1 = req.body.size1;
  const price1 = req.body.price1;
  const price_1 =
    price1.length > 0
      ? [price1[0], price1[1], price1[2], price1[3], price1[4]]
      : ['', '', '', '', '', ''];
  const subcategory = {
    color: {
      name: color,
      images: [...imagesArr],
    },

    size: {
      val: size1,
      price: [...price_1],
    },
  };

  const product = new Product({
    name: name,
    description: description,
    prodType: prodType,
    subcategory: subcategory,
  });
  console.log(product);
  await product.save();
};

// Show all Products
exports.showAllProducts = async (req, res, next) => {
  const prodKurtas = await Product.find({
    prodType: req.query.disp,
  });
  res.render('admin/pages/all_products.ejs', {
    editing: false,
    user: req.user,
    prodKurtas: prodKurtas,
    prodType: `${req.query.disp}s`,
  });
};

// Get the edit-product page
exports.getEditProduct = async (req, res, next) => {
  console.log('you just clicked the edit button.');
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/admin/dashboard');
  }

  const prodId = req.params.productId;
  try {
    const product = await Product.findById(prodId);
    console.log(product);
    if (!product) {
      return res.redirect('/admin/products');
    }
    console.log(product.description);
    return res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      user: req.user,
      editing: editMode,
      product: product,
    });
  } catch (error) {
    console.log(error);
  }
};

// Editing product logic
exports.postEditProduct = async (req, res, next) => {
  let prodId = req.body.productId;
  const product = await Product.findById(prodId);
  let updatedName = req.body.name;
  let updatedDescription =
    req.body.description === '' ? product.description : req.body.description;
  let updatedProdType = req.body.prodtype;
  let updatedColor = req.body.color;
  let images = req.files;
  const previousPriceArr = [...product.subcategory.size.price];
  const previousSizeArr = [...product.subcategory.size.val];
  const imagesArrDel = [...product.subcategory.color.images];
  // Deleting the images from the local
  if (images !== undefined && images.length === 3) {
    imagesArrDel.forEach(img => {
      let imgName = img.split('\\');
      let delImg = `./${imgName[0]}/${imgName[1]}`;
      fs.unlink(delImg, err => {
        if (err) {
          console.error(err);
          return;
        } else {
          console.log('Deleted Successfully');
        }
      });
    });
  }
  // Updated Image
  const updatedImagesArr =
    undefined !== images && images.length > 1
      ? [images[0].path, images[1].path, images[2].path]
      : [...imagesArrDel];
  // Updated Size values
  const sizeArr =
    req.body.size1 === undefined ? [...previousSizeArr] : req.body.size1;
  // Updated price values
  const priceArr = req.body.price1;
  const updatedPrice =
    priceArr.length > 0
      ? [priceArr[0], priceArr[1], priceArr[2], priceArr[3], priceArr[4]]
      : [...previousPriceArr];
  // Updated Sub-category
  const updatedSubcategory = {
    color: {
      name: updatedColor,
      images: [...updatedImagesArr],
    },
    size: {
      val: sizeArr,
      price: [...updatedPrice],
    },
  };
  Product.findById(prodId)
    .then(product => {
      product.name = updatedName;
      product.description = updatedDescription;
      product.prodType = updatedProdType;
      product.subcategory = updatedSubcategory;
      return product.save();
    })
    .then(result => {
      console.log('Product Updated Successfully');
      res.redirect(`/admin/show-All-Kurtas?disp=${updatedProdType}`);
    })
    .catch(err => {
      console.log(err);
    });
};

// Deleting the product
exports.postDeleteProduct = async (req, res, next) => {
  const productId = req.body.productId;
  const product = await Product.findById(productId);

  const imgUrls = [...product.subcategory.color.images];
  imgUrls.forEach(img => {
    let imgName = img.split('\\');
    let delImg = `./${imgName[0]}/${imgName[1]}`;
    fs.unlink(delImg, err => {
      if (err) {
        console.error(err);
        return;
      } else {
        console.log('Deleted Successfully');
      }
    });
  });

  Product.deleteOne({ _id: productId })
    .then(() => {
      console.log(`DESTROYED ${product.prodType}`);
      res.redirect(`/admin/show-All-Kurtas?disp=${product.prodType}`);
    })
    .catch(err => {
      console.log(error);
    });
};

// For testing purposes req.body.productId returns undefined
exports.getTest = async (req, res, next) => {
  const prodId = req.params.productId;
  const product = await Product.findById(prodId);

  res.render('admin/test', {
    pageTitle: 'Edit Product',
    product: product,
  });
};

exports.getPostTest = (req, res, next) => {
  console.log('working');
  let id = req.body.productId;
  let name = req.body.prodName;
  console.log(id, name);
};
