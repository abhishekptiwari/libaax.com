const express = require('express');
const heroController = require('../Controllers/heroController');
const { uploadly } = require('../Controllers/heroController');

const router = express.Router();

router.get('/add-hero', heroController.getHeroPage);
router.post('/add-hero', uploadly.single('image'), heroController.postHeroPage);
router.get('/allHeros', heroController.getALlHerosPage);
router.post('/delete-Hero', heroController.postDeleteHero);
module.exports = router;
