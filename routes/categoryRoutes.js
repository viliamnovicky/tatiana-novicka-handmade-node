const express = require('express');
const categoriesController = require('./../controllers/categoriesController');
const authController = require('./../controllers/authController');

const router = express.Router()

router.route("/").post(
    categoriesController.uploadCategoryImage, 
    categoriesController.resizeCategoryImages, 
    categoriesController.createNewCategory)
    .get(categoriesController.getCategories)

router.route("/:id").get(categoriesController.getOneCategory)

module.exports = router