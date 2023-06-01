const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const Admin = require('./../models/adminModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Email = require('./../utils/email');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (admin, statusCode, req, res) => {
  const token = signToken(admin._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });

  // Remove password from output
  admin.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      admin
    }
  });
};


exports.signup = catchAsync(async (req, res, next) => {
  const newAdmin = await Admin.create({
    name: req.body.name,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  res.status(200).json({
    status: "success"
  })

  createSendToken(newAdmin, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { name, password } = req.body;

  // 1) Check if email and password exist
  if (!name || !password) {
    return next(new AppError('Prosím, zadajte meno a heslo!', 400));
  }
  // 2) Check if admin exists && password is correct
  const admin = await Admin.findOne({ name }).select('+password');

  if (!admin || !(await admin.correctPassword(password, admin.password))) {
    return next(new AppError('Nesprávne meno alebo heslo', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(admin, 200, req, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('Nie ste prihlásený! Prihláste sa pre získanie prístupu.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if admin still exists
  const currentAdmin = await Admin.findById(decoded.id);
  if (!currentAdmin) {
    return next(
      new AppError(
        'Užívateľ neexistuje.',
        401
      )
    );
  }

  // 4) Check if admin changed password after the token was issued
  if (currentAdmin.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('Užívateľ si nedávno zmenil heslo! Prosím, prihláste sa znova.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.admin = currentAdmin;
  res.locals.admin = currentAdmin;
  next();
});

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if admin still exists
      const currentAdmin = await Admin.findById(decoded.id);
      if (!currentAdmin) {
        return next();
      }

      // 3) Check if Admin changed password after the token was issued
      if (currentAdmin.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN admin
      res.locals.admin = currentAdmin;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get admin based on POSTed email
  const admin = await Admin.findOne({ email: req.body.email });
  if (!admin) {
    return next(new AppError('Užívateľ s touto emailovou adresou neexistuje.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = admin.createPasswordResetToken();
  await admin.save({ validateBeforeSave: false });

  // 3) Send it to admin's email
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/admins/resetPassword/${resetToken}`;
    await new Email(admin, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token bol odoslaný na email!'
    });
  } catch (err) {
    admin.passwordResetToken = undefined;
    admin.passwordResetExpires = undefined;
    await admin.save({ validateBeforeSave: false });

    return next(
      new AppError('Pri odosielaní emailu nastala chyba. Skúste to prosím znova.'),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get admin based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const admin = await Admin.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is admin, set the new password
  if (!admin) {
    return next(new AppError('Token je neplatný.', 400));
  }
  admin.password = req.body.password;
  admin.passwordConfirm = req.body.passwordConfirm;
  admin.passwordResetToken = undefined;
  admin.passwordResetExpires = undefined;
  await admin.save();

  // 3) Update changedPasswordAt property for the admin
  // 4) Log the admin in, send JWT
  createSendToken(admin, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get admin from collection
  const admin = await Admin.findById(req.admin.id).select('+password');

  // 2. Check if POSTed current password is correct
  if (
    !admin ||
    !(await admin.correctPassword(req.body.passwordCurrent, admin.password))
  ) {
    return next(new AppError('Zadali ste zlé aktuálne heslo', 400));
  }

  // 3) If so, update password
  admin.password = req.body.password;
  admin.passwordConfirm = req.body.passwordConfirm;
  await admin.save();
  // admin.findByIdAndUpdate will NOT work as intended!

  // 4) Log admin in, send JWT
  createSendToken(admin, 200, req, res);
});