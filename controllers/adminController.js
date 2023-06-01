const Admin = require("./../models/adminModel")
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
  };
  
  exports.getMe = (req, res, next) => {
    req.params.id = req.admin.id;
    next();
  };
  
  exports.deleteMe = catchAsync(async (req, res, next) => {
    await Admin.findByIdAndUpdate(req.admin.id, { active: false });
  
    res.status(204).json({
      status: 'seccess',
      data: null,
    });
  });
  
  // Do not update password with this
  exports.updateAdmin = factory.updateOne(Admin);
  exports.deleteAdmin = factory.deleteOne(Admin);
  exports.getAdmin = factory.getOne(Admin);
  exports.getAllAdmins = factory.getAll(Admin);