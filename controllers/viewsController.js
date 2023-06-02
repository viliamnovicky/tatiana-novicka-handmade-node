const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Category = require("../models/categoryModel")
const Product = require("../models/productModel")

exports.getHomePage = catchAsync(async (req, res, next) => {
    res.status(200).render("home", {
        title: "Tatiana Novická handmade"
    })
})

exports.getCustomersPage = catchAsync(async (req, res, next) => {
    res.status(200).render("customers", {
        title: "Spokojní zákazníci"
    })
})

exports.getContactPage = catchAsync(async (req, res, next) => {
    res.status(200).render("contact", {
        title: "Kontakt"
    })
})

exports.getProductsPage = catchAsync(async (req, res, next) => {
    const categories = await Category.find().sort("name")
    res.status(200).render("products", {
        title: "Produkty",
        categories
    })
})

exports.getCategoryPage = catchAsync(async (req, res, next) => {
    const category = await Product.find({ category: req.params.category })

    if (!category) {
        return next(new AppError("Kategória sa nenašla 😥", 404))
    }

    console.log(category)

    res.status(200).render("category", {
        title: req.params.category,
        category,
        currentUrl: "products"
    })
})

exports.getProductPage = catchAsync(async (req, res, next) => {
    const product = await Product.findOne({ _id: req.params.id })

    if (!product) {
        return next(new AppError("Produkt sa nenašiel 😥", 404))
    }

    res.status(200).render("product", {
        title: product.name,
        product,
        currentUrl: "product"
    })
})

exports.getAdminPage = catchAsync(async (req, res, next) => {
    const categories = await Category.find()
    const products = await Product.find().sort("name")

    res.status(200).render("admin", {
        title: "admin",
        categories,
        products
    })
})

exports.getNewItemPage = catchAsync(async (req, res, next) => {
    const categories = await Category.find()
    res.status(200).render("new-item", {
        title: "Nový produkt",
        categories
    })
})

exports.getUpdateItemPage = catchAsync(async (req, res, next) => {
    const categories = await Category.find()
    const product = await Product.findOne({ _id: req.params.id })
    res.status(200).render("update-item", {
        title: "Upraviť produkt",
        currentUrl: "update-product",
        categories,
        product
    })
})

exports.getNewCategoryPage = catchAsync(async (req, res, next) => {
    res.status(200).render("new-category", {
        title: "Nová kategória"
    })
})