const path = require('path');
const Hero = require('../models/heroModel');
const multer = require('multer');
const fs = require('fs');

// Storage KEY
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dir = './public/prodHeroImage/';
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
exports.uploadly = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
});

exports.getHeroPage = (req, res, next) => {
  res.render('admin/add-hero.ejs');
};

exports.postHeroPage = async (req, res, next) => {
  const title = req.body.title;
  const main_header = req.body.header;
  const description = req.body.description;
  const img = req.file;

  const hero = new Hero({
    title: title,
    main_header: main_header,
    description: description,
    imageUrl: img.path,
  });
  console.log(req.body);
  await hero.save();
};

exports.getALlHerosPage = async (req, res, next) => {
  const Heros = await Hero.find({});
  console.log(Heros);
  res.render('admin/pages/all_heros.ejs', {
    Heros: Heros,
  });
};

// Deleting the hero
exports.postDeleteHero = async (req, res, next) => {
  const heroId = req.body.heroId;
  console.log(heroId);
  const hero = await Hero.findById(heroId);
  const imgUrl = hero.imageUrl.split('\\');
  const delImgPath = `./${imgUrl[0]}/${imgUrl[1]}/${imgUrl[2]}`;
  console.log(delImgPath);
  Hero.deleteOne({ _id: heroId })
    .then(() => {
      fs.unlink(delImgPath, err => {
        if (err) {
          console.error(err);
          return;
        } else {
          console.log('Hero Deleted Successfully');
        }
      });
      console.log('DESTROYED Hero from db');
      res.redirect('/admin/allHeros');
    })
    .catch(err => {
      console.log(err);
    });
};
