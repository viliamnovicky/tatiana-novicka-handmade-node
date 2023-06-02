const Product = require("../models/productModel")
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadProductImages = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'productImages', maxCount: 3 },
]);

exports.resizeProductImages = catchAsync(async (req, res, next) => {

  if (!req.files.coverImage && !req.files.productImages) return next();

  //1. Cover image
  req.body.coverImage = `product-${req.body.name}-${Date.now()}-cover.jpeg`;
  try {
    await sharp(req.files.coverImage[0].buffer)
      .resize(1000, 666)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/products/${req.body.coverImage}`);
  } catch (err) { console.log(err) }


  // 2. Images
  if (req.files.productImages) {
    req.body.productImages = [];

    await Promise.all(
      req.files.productImages.map(async (file, i) => {
        const filename = `product-${req.body.name}-${Date.now()}-${i + 1}.jpeg`;

        await sharp(file.buffer)
          .resize(1000, 666)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/products/${filename}`);

        req.body.productImages.push(filename);
      })
    );
  }
  next();
});

exports.createNewProduct = factory.createOne(Product)
exports.getProducts = factory.getAll(Product)
exports.getOneProduct = factory.getOne(Product)
exports.deleteOneProduct = factory.deleteOne(Product)
exports.updateOneProduct = factory.updateOne(Product)