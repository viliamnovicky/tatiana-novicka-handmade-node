const express = require('express');
const authController = require('./../controllers/authController');
const adminController = require('./../controllers/adminController');

const router = express.Router();

router.post("/signup", authController.signup)
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);
router.patch('/updateMyPassword', authController.updatePassword);
//router.get('/me', adminController.getMe, adminController.getUser);

module.exports = router;