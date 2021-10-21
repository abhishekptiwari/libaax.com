const express = require('express');
const shopController = require('../Controllers/shopController');
const router = express.Router();

router.get('/', shopController.getHome);

router.get('/about', shopController.getAbout);

router.get('/contact', shopController.getContact);

router.get('/shop', shopController.getShop);

router.get('/shop-detail/:productId', shopController.getProduct);

module.exports = router;
