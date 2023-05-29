const Category = require("./../models/categoryModel")
const catchAsync = require('./../utils/catchAsync');
const multer = require('multer');
const sharp = require('sharp');
const AppError = require('./../utils/appError');
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

exports.uploadCategoryImage = upload.fields([
  { name: 'coverImage', maxCount: 1 }
]);

exports.resizeCategoryImages = catchAsync(async (req, res, next) => {
  if (!req.files.coverImage) return next();

  //1. Cover image
  req.body.coverImage = `category-${req.body.name}-cover.jpeg`;

  await sharp(req.files.coverImage[0].buffer)
    .resize(500, 340)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/categories/${req.body.coverImage}`);

  next();
});

exports.createNewCategory = factory.createOne(Category)
exports.getCategories = factory.getAll(Category)
exports.getOneCategory = factory.getOne(Category)