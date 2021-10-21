const path = require('path');
const Offer = require('../models/offerModel');
const multer = require('multer');
const fs = require('fs');

// Storage KEY
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dir = './public/offerImages/';
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
exports.uploadOffer = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
});

// Get Add Offer Page
exports.getAddOfferPage = (req, res, next) => {
  res.render('admin/add-offer.ejs', {
    editing: false,
  });
};

// Post Add Offer Page ( Saving to the DB )
exports.postAddOffer = async (req, res, next) => {
  const title = req.body.title;
  const btn_link = req.body.link;
  const img = req.file;
  const offer = new Offer({
    title: title,
    btn_link: btn_link,
    imageUrl: img.path,
  });
  console.log(req.body);
  await offer.save();
  // res.redirect('/admin/allOffers');
};
exports.getALlofferPage = async (req, res, next) => {
  const Offers = await Offer.find({});
  res.render('admin/pages/all_offers.ejs', {
    Offers: Offers,
    editing: false,
  });
};

exports.getEditOfferPage = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/admin/dashboard');
  }

  const offerId = req.params.offerId;
  try {
    const offer = await Offer.findById(offerId);
    console.log(offer);
    if (!offer) {
      return res.redirect('/admin/products');
    }
    return res.render('admin/add-offer.ejs', {
      pageTitle: 'Edit Offer',
      user: req.user,
      editing: editMode,
      offer: offer,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postEditOffer = async (req, res, next) => {
  const offerId = req.body.offerId;
  const offer = await Offer.findById(offerId);
  const updatedTitle = req.body.title === '' ? offer.title : req.body.title;
  const updatedBtn_link = req.body.link === '' ? '#' : req.body.link;
  const previousImg = offer.imageUrl;
  let updatedImg = req.file;
  if (updatedImg !== undefined) {
    let imgName = previousImg.split('\\');
    let delImg = `./${imgName[0]}/${imgName[1]}/${imgName[2]}`;
    fs.unlink(delImg, err => {
      if (err) {
        console.error(err);
        return;
      } else {
        console.log('Offer Image Deleted Successfully');
      }
    });
    updatedImg = req.file.path;
  } else {
    updatedImg = previousImg;
  }
  // Updating it in Database
  Offer.findById(offerId)
    .then(offer => {
      offer.title = updatedTitle;
      offer.btn_link = updatedBtn_link;
      offer.imageUrl = updatedImg;
      return offer.save();
    })
    .then(result => {
      console.log('Offer Updated Successfully');
      res.redirect('/admin/allOffers');
    });
};
