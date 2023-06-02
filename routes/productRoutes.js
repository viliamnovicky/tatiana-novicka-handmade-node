const express = require('express');
const productsController = require('../controllers/productsController');
const authController = require('./../controllers/authController');

const router = express.Router()

router.route("/").post(
    productsController.uploadProductImages,
    productsController.resizeProductImages,
    productsController.createNewProduct)
    
router.route("/").get(productsController.getProducts)

router.route("/:id")
    .get(productsController.getOneProduct)
    .delete(productsController.deleteOneProduct)
    .patch(productsController.updateOneProduct)

module.exports = router