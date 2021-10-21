const express = require('express');
const offerController = require('../Controllers/offerController');
const { uploadOffer } = require('../Controllers/offerController');

const router = express.Router();

router.get('/add-offer', offerController.getAddOfferPage);
router.post(
  '/add-offer',
  uploadOffer.single('image'),
  offerController.postAddOffer
);
router.get('/allOffers', offerController.getALlofferPage);
router.get('/edit-offer/:offerId', offerController.getEditOfferPage);
router.post(
  '/edit-offer',
  uploadOffer.single('image'),
  offerController.postEditOffer
);
module.exports = router;
