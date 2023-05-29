const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router()

router.get("/", viewsController.getHomePage)
router.get("/produkty", viewsController.getProductsPage)
router.get("/zakaznici", viewsController.getCustomersPage)
router.get("/kontakt", viewsController.getContactPage)
router.get("/novy-produkt", viewsController.getNewItemPage)
router.get("/produkty/:category", viewsController.getCategoryPage)
router.get("/produkty/:category/:id", viewsController.getProductPage)

module.exports = router