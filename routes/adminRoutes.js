const express = require('express');
const authController = require('../Controllers/authController');
const adminController = require('../Controllers/adminController');
const { upload } = require('../Controllers/adminController');
const router = express.Router();

// Admin signIn
// router.get('/sign-in', authController.getAdminSign_In);

// Admin Dashboard
router.get('/dashboard', adminController.getadminDashboard);
router.get('/add-product', adminController.getAddProduct);
router.post(
  '/add-product',
  upload.array('images', 3),
  adminController.postAddProduct
);

router.get('/show-All-Kurtas', adminController.showAllProducts);
router.get('/show-All-Shirts', adminController.showAllProducts);

// /admin/edit-product/:ObjectId => GET
router.get('/edit-product/:productId', adminController.getEditProduct);
// router.get('/edit-product/:productId', adminController.getTest); // For Testing Purposes (req.body.productId = undefined)

// /admin/edit-product
router.post(
  '/edit-product',
  upload.array('images', 3),
  adminController.postEditProduct
);
// /admin/delete-product
router.post('/delete-product', adminController.postDeleteProduct);
// router.post('/test-post', adminController.getPostTest); // For Testing Purposes (req.body.productId = undefined)

module.exports = router;
