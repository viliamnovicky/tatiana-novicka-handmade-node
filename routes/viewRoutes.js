const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router()

router.get("/", authController.isLoggedIn, viewsController.getHomePage)
router.get("/produkty", authController.isLoggedIn, viewsController.getProductsPage)
router.get("/zakaznici", authController.isLoggedIn, viewsController.getCustomersPage)
router.get("/kontakt", authController.isLoggedIn, viewsController.getContactPage)
router.get("/novy-produkt", authController.isLoggedIn, viewsController.getNewItemPage)
router.get("/produkty/:category", authController.isLoggedIn, viewsController.getCategoryPage)
router.get("/produkty/:category/:id", authController.isLoggedIn, viewsController.getProductPage)
router.get("/nova-kategoria", authController.isLoggedIn, viewsController.getNewCategoryPage)
router.get("/admin", authController.isLoggedIn, viewsController.getAdminPage)

module.exports = router